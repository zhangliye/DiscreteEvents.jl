const sleeptime = 0.5

println("... testing multithreading  1, (sleeptime=$sleeptime) ...")
println("number of available threads: ", nthreads())

clk = PClock()
Δt = clk.Δt
sleep(sleeptime)

print(clk)
@test clk.id == 0
m = match(r"Clock 0, thrd 1 \(\+ (\d+) ac\)", repr(clk))
@test parse(Int, m.captures[1]) > 0
@test length(clk.ac) == nthreads()-1
@test clk.ac[1].thread == 2

println("... parallel clock identification ...")
c1 = pclock(clk, 1)
@test c1.thread == 2
@test c1.clock.id == 1
m = match(r"Active clock 1 on thrd (\d+)\:", repr(c1))
@test parse(Int, m.captures[1]) > 1

if DiscreteEvents._handle_exceptions[1]
    println("... remote error handling ...")
    put!(clk.ac[1].forth, DiscreteEvents.Clear())
    sleep(sleeptime)
    err = diagnose(clk, 1)
    @test err[1] isa ErrorException
    @test occursin(r"^step\!\(\:\:DiscreteEvents.ActiveClock.+ at threads\.jl", string(err[2][2]))
end

println("... testing channel and active clock ...")
a = 0
ev = DiscreteEvents.DiscreteEvent(fun(()->global a+=1),1.0,0.0)
put!(clk.ac[1].forth, DiscreteEvents.Register(ev))
sleep(sleeptime)
@test length(c1.clock.sc.events) == 1
cev = DiscreteEvents.DiscreteCond(fun(≥, fun(tau, c1), 5), fun(()->global a+=1))
put!(clk.ac[1].forth, DiscreteEvents.Register(cev))
sleep(sleeptime)
@test length(c1.clock.sc.cevents) == 1
b = 0
sp = DiscreteEvents.Sample(fun(()->global b+=1))
put!(clk.ac[1].forth, DiscreteEvents.Register(sp))
sleep(sleeptime)
@test length(c1.clock.sc.samples) == 1

println("... run parallel clock 1 (thread 2) ...")
# put!(clk.ac[1].forth, DiscreteEvents.Run(10.0))
# @test take!(clk.ac[1].back).t > 0
# sleep(sleeptime)
tns = 0
t1 = time_ns()
iter = 0
while (c1.clock.time+Δt) ≤ 10
    put!(clk.ac[1].forth, DiscreteEvents.Run(Δt, false))
    global tns += take!(clk.ac[1].back).t
    global iter += 1
end
t1 = time_ns() - t1
println("$iter ticks took $(Int(t1)*1e-9) s, clock time $(Int(tns)*1e-9) s")
@test c1.clock.time ≈ 10
@test c1.clock.scount == 1000
@test a == 2
@test b == 1000

println("... parallel clock 1 reset ...")
put!(clk.ac[1].forth, DiscreteEvents.Reset(true))
@test take!(clk.ac[1].back).x == 1
@test c1.clock.time == 0
@test c1.clock.scount == 0

println("... testing register(!) five cases ... ")
ev1 = DiscreteEvents.DiscreteEvent(fun(()->global a+=1),1.0,0.0)
ev2 = DiscreteEvents.DiscreteEvent(fun(()->global a+=1),2.0,0.0)
DiscreteEvents._register(clk, ev1, 0)              # 1. register ev1 to clk
@test DiscreteEvents._nextevent(clk) == ev1
DiscreteEvents._register(clk, ev1, 1)              # 2. register ev1 to 1st parallel clock
sleep(sleeptime)
@test DiscreteEvents._nextevent(c1.clock) == ev1
DiscreteEvents._register(c1, ev2, 1)               # 3. register ev2 directly to 1st parallel clock
sleep(sleeptime)
@test length(c1.clock.sc.events) == 2
DiscreteEvents._register(c1, ev2, 0)               # 4. register ev2 back to master
sleep(sleeptime)
@test length(clk.sc.events) == 2

if nthreads() > 2                           # This fails on CI (only 2 threads)
    DiscreteEvents._register(c1, ev2, 2)           # 5. register ev2 to another parallel clock
    c2 = pclock(clk, 2)
    sleep(sleeptime)
    @test DiscreteEvents._nextevent(c2.clock) == ev2
end

println("... testing API on multiple threads ...")

function clocks_ok(clk::Clock)
    ok = true
    for i in eachindex(clk.ac)
        while isready(clk.ac[i].back)
            token = take!(clk.ac[i].back)
            if token isa Error
                println("clock $i error: ", token.exc)
                ok = false
            end
        end
        if istaskfailed(clk.ac[i].ref[])
            println("clock $i error, stacktrace:")
            println(clk.ac[i].ref[])
            ok = false
        end
    end
    return ok
end

clock = Vector{Clock}()
push!(clock, clk)
for i in eachindex(clk.ac)
    push!(clock, pclock(clk, i).clock)
end
println("    got $(length(clock)) clocks")
@test sum(length(c.sc.events) for c in clock) ≥ 4
resetClock!(clk)                                 # test resetClock! on multiple clocks
@test clk.Δt == Δt                          # must still be the same
@test sum(length(c.sc.events) for c in clock) == 0
println("    resetClock!     ok")

a = zeros(Int, nthreads())
event!(clk, ()->a[1]+=1, 1)
sleep(sleeptime); @test clocks_ok(clk)
event!(clk, ()->a[2]+=1, 1, cid=1)
sleep(sleeptime); @test clocks_ok(clk)
event!(c1,  ()->a[2]+=1, 2)
sleep(sleeptime); @test clocks_ok(clk)
event!(c1,  ()->a[1]+=1, 2, cid=0)
sleep(sleeptime); @test clocks_ok(clk)
if nthreads() > 2
    event!(c1,  ()->a[3]+=1, 1, cid=2)
    sleep(sleeptime); @test clocks_ok(clk)
end
sleep(sleeptime)
@test length(clk.sc.events) == 2
@test length(c1.clock.sc.events) == 2
nthreads() > 2 && @test length(c2.clock.sc.events) == 1
error = false
@test !error
println("    distributed events ok")
run!(clk, 3)
@test a[1] == 2
@test a[2] == 2
nthreads() > 2 && @test a[3] == 1
println("    first parallel run ok")

println("... collapse! ...")
ac = clk.ac
collapse!(clk)
@test all(x->istaskdone(x.ref[]), ac)
@test all(x->x.ch.state == :closed, ac)
