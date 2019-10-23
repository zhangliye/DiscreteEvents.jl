var documenterSearchIndex = {"docs":
[{"location":"usage/#User-guide-1","page":"Usage","title":"User guide","text":"","category":"section"},{"location":"usage/#","page":"Usage","title":"Usage","text":"CurrentModule = Sim","category":"page"},{"location":"usage/#","page":"Usage","title":"Usage","text":"Sim.jl is not yet an registered package and is installed with","category":"page"},{"location":"usage/#","page":"Usage","title":"Usage","text":"pkg> add(\"https://github.com/pbayer/jl\")","category":"page"},{"location":"usage/#","page":"Usage","title":"Usage","text":"The package is then loaded with","category":"page"},{"location":"usage/#","page":"Usage","title":"Usage","text":"using Sim","category":"page"},{"location":"usage/#Modeling-and-simulation-1","page":"Usage","title":"Modeling and simulation","text":"","category":"section"},{"location":"usage/#Silly-example-1","page":"Usage","title":"Silly example","text":"","category":"section"},{"location":"usage/#","page":"Usage","title":"Usage","text":"using Printf\nsim = Clock(); # create a clock\ncomm = [\"Hi, nice to meet you!\", \"How are you?\", \"Have a nice day!\"];\ngreet(name, n) =  @printf(\"%5.2f s, %s: %s\\n\", now(sim), name, comm[n])\nfunction foo(n) # 1st passerby\n    greet(\"Foo\", n)\n    event!(sim, :(bar($n)), after, 2*rand())\nend\nfunction bar(n) # 2nd passerby\n    greet(\"Bar\", n)\n    if n < 3\n       event!(sim, :(foo($n+1)), after, 2*rand())\n    else\n       println(\"bye bye\")\n    end\nend\nevent!(sim, :(foo(1)), at, 10*rand()); # create one event for a good start\nrun!(sim, 20) # and run the simulation","category":"page"},{"location":"usage/#","page":"Usage","title":"Usage","text":"A virtual Clock allows to schedule Julia expressions as timed events or as sampling actions, which occur at predefined clock ticks. When we run the Clock, it fires the events at their scheduled times and executes the sampling actions at each tick.","category":"page"},{"location":"usage/#Types-1","page":"Usage","title":"Types","text":"","category":"section"},{"location":"usage/#","page":"Usage","title":"Usage","text":"Clock\nTiming","category":"page"},{"location":"usage/#Sim.Clock","page":"Usage","title":"Sim.Clock","text":"Clock(Δt::Number=0; t0::Number=0)\n\nCreate a new simulation clock.\n\nArguments\n\nΔt::Number=0: time increment\nt0::Number=0: start time for simulation.\n\nIf no Δt is given, the simulation doesn't tick, but jumps from event to event. Δt can be set later with sample_time!.\n\n\n\n\n\n","category":"type"},{"location":"usage/#Sim.Timing","page":"Usage","title":"Sim.Timing","text":"Timing\n\nEnumeration type for scheduling events and timed conditions:\n\nat: schedule an event at agiven time\nafter: schedule an event a given time after current time\nevery: schedule an event every given time from now\nbefore: a timed condition is true before a given time.\n\n\n\n\n\n","category":"type"},{"location":"usage/#Functions-1","page":"Usage","title":"Functions","text":"","category":"section"},{"location":"usage/#","page":"Usage","title":"Usage","text":"now\nsample_time!\nevent!\nsample!\nincr!\nrun!\nstop!\nresume!","category":"page"},{"location":"usage/#Sim.now","page":"Usage","title":"Sim.now","text":"now(sim::Clock)\n\nReturn the current simulation time.\n\n\n\n\n\n","category":"function"},{"location":"usage/#Sim.sample_time!","page":"Usage","title":"Sim.sample_time!","text":"sample_time!(sim::Clock, Δt::Number)\n\nset the clock's sampling time from now(sim).\n\nArguments\n\nsim::Clock\nΔt::Number: sample rate, time interval for sampling\n\n\n\n\n\n","category":"function"},{"location":"usage/#Sim.event!","page":"Usage","title":"Sim.event!","text":"    event!(sim::Clock, expr::Expr, t::Number; scope::Module=Main, cycle::Number=0.0)::Float64\n    event!(sim::Clock, expr::Expr, T::Timing, t::Number; scope::Module=Main)::Float64\n\nSchedule an expression for execution at a given simulation time.\n\nArguments\n\nsim::Clock: simulation clock\nexpr::Expr: an expression\nt::Float64: simulation time\nscope::Module=Main: scope for the expression to be evaluated\ncycle::Float64=0.0: repeat cycle time for the event\nT::Timing: a timing, at, after or every (before behaves like at)\n\nreturns\n\nScheduled simulation time for that event.\n\nMay return a time t > at from repeated applications of nextfloat(at) if there were yet events scheduled for that time.\n\n\n\n\n\n","category":"function"},{"location":"usage/#Sim.sample!","page":"Usage","title":"Sim.sample!","text":"sample!(sim::Clock, expr::Expr; scope::Module=Main)\n\nenqueue an expression for sampling.\n\nArguments\n\nsim::Clock\nexpr::Expr: a Julia expression\nscope::Module=Main: optional, a scope for the expression to be evaluated in\n\n\n\n\n\n","category":"function"},{"location":"usage/#Sim.incr!","page":"Usage","title":"Sim.incr!","text":"incr!(sim::Clock)\n\nTake one simulation step, execute the next tick or event.\n\n\n\n\n\n","category":"function"},{"location":"usage/#Sim.run!","page":"Usage","title":"Sim.run!","text":"run!(sim::Clock, duration::Number)\n\nRun a simulation for a given duration.\n\nCall scheduled events and evaluate sampling expressions at each tick in that timeframe.\n\n\n\n\n\n","category":"function"},{"location":"usage/#Sim.stop!","page":"Usage","title":"Sim.stop!","text":"stop!(sim::Clock)\n\nStop a running simulation.\n\n\n\n\n\n","category":"function"},{"location":"usage/#Sim.resume!","page":"Usage","title":"Sim.resume!","text":"resume!(sim::Clock)\n\nResume a halted simulation.\n\n\n\n\n\n","category":"function"},{"location":"usage/#Logging-1","page":"Usage","title":"Logging","text":"","category":"section"},{"location":"usage/#","page":"Usage","title":"Usage","text":"A Logger allows to register variables and to record their states on demand. The last record is stored in the logging variable. According to the Logger's state it can be printed or stored in a table.","category":"page"},{"location":"usage/#Example-1","page":"Usage","title":"Example","text":"","category":"section"},{"location":"usage/#","page":"Usage","title":"Usage","text":"sim = Clock(); # create a clock\nl = Logger(); # create a logging variable\ninit!(l, sim); # initialize the logger\na, b, c = 1, 1, 1 # create some variables\nsetup!(l, [:a, :b, :c]); # register them for logging\nrecord!(l) # record the variables with the current clock time\nl.last # show the last record\nfunction f()  # a function for increasing and recording the variables\n  global a += 1\n  global b = a^2\n  global c = a^3\n  record!(l)\nend\nswitch!(l, 1); # switch logger to printing\nf() # increase and record the variables\nswitch!(l, 2); # switch logger to storing in data table\nfor i in 1:10 # create some events\n    event!(sim, :(f()), i)\nend\nrun!(sim, 10) # run a simulation\nl.df # view the recorded values","category":"page"},{"location":"usage/#Types-2","page":"Usage","title":"Types","text":"","category":"section"},{"location":"usage/#","page":"Usage","title":"Usage","text":"Logger","category":"page"},{"location":"usage/#Sim.Logger","page":"Usage","title":"Sim.Logger","text":"Logger()\n\nSetup and return a logging variable.\n\n\n\n\n\n","category":"type"},{"location":"usage/#Functions-2","page":"Usage","title":"Functions","text":"","category":"section"},{"location":"usage/#","page":"Usage","title":"Usage","text":"init!\nsetup!\nswitch!\nrecord!\nclear!","category":"page"},{"location":"usage/#Sim.init!","page":"Usage","title":"Sim.init!","text":"init!(sim::Clock)\n\ninitialize a clock.\n\n\n\n\n\ninit!(L::Logger, sim::Clock)\n\nInitialize a Logger.\n\n\n\n\n\n","category":"function"},{"location":"usage/#Sim.setup!","page":"Usage","title":"Sim.setup!","text":"setup!(L::Logger, vars::Array{Symbol})\n\nSetup a logger with logging variables.\n\nArguments\n\nL::Logger\nvars::Array{Symbol}: An array of symbols, e.g. of global variables\n\n\n\n\n\n","category":"function"},{"location":"usage/#Sim.switch!","page":"Usage","title":"Sim.switch!","text":"switch!(L::Logger, to::Number=0)\n\nSwitch the operating mode of a logger.\n\nto = 0: no output, to = 1: print, `to = 2: store in log table\"\n\n\n\n\n\n","category":"function"},{"location":"usage/#Sim.record!","page":"Usage","title":"Sim.record!","text":"record!(L::Logger)\n\nrecord the logging variables with the current operating mode.\n\n\n\n\n\n","category":"function"},{"location":"usage/#Sim.clear!","page":"Usage","title":"Sim.clear!","text":"clear!(L::Logger)\n\nclear the loggers last record and data table.\n\n\n\n\n\n","category":"function"},{"location":"examples/#Examples-1","page":"Examples","title":"Examples","text":"","category":"section"},{"location":"examples/#Programs-1","page":"Examples","title":"Programs","text":"","category":"section"},{"location":"examples/#","page":"Examples","title":"Examples","text":"are at https://github.com/pbayer/Sim.jl/tree/master/docs/examples","category":"page"},{"location":"examples/#Notebooks-1","page":"Examples","title":"Notebooks","text":"","category":"section"},{"location":"examples/#","page":"Examples","title":"Examples","text":"tabletennis.ipnb: Simple table tennis simulation.","category":"page"},{"location":"overview/#Discrete-event-simulation-with-Sim.jl-1","page":"Overview","title":"Discrete event simulation with Sim.jl","text":"","category":"section"},{"location":"overview/#","page":"Overview","title":"Overview","text":"Sim.jl evaluates Julia expressions at given (virtual) simulation times.\nThus discrete event systems based on state machines can be modeled and simulated.\nVariables can be logged over simulation time and then accessed for","category":"page"},{"location":"overview/#","page":"Overview","title":"Overview","text":"analysis or visualization.","category":"page"},{"location":"overview/#The-clock-1","page":"Overview","title":"The clock","text":"","category":"section"},{"location":"overview/#","page":"Overview","title":"Overview","text":"Sim.jl provides a clock for a simulation time  (a Float64) with an arbitrary unit of time.","category":"page"},{"location":"overview/#","page":"Overview","title":"Overview","text":"Clock(Δt::Number=0; t0::Number=0): create a new clock with start time t0 and sample time Δt.\nnow(sim::Clock): return the current simulation time.\nsample_time!(sim::Clock, Δt::Number): set the clock's sample rate starting from now(sim).","category":"page"},{"location":"overview/#","page":"Overview","title":"Overview","text":"If no Δt is given, the simulation doesn't tick with a fixed interval, but jumps from event to event.","category":"page"},{"location":"overview/#Expressions-as-Events-1","page":"Overview","title":"Expressions as Events","text":"","category":"section"},{"location":"overview/#","page":"Overview","title":"Overview","text":"Julia expressions are scheduled as events on the clock's time line:","category":"page"},{"location":"overview/#","page":"Overview","title":"Overview","text":"event!(sim::Clock, expr::Expr, t::Float64) or\nevent!(sim, expr, at, t): schedule an expression for evaluation at a given simulation time.\nevent!(sim, expr, after, t): schedule an expression for evaluation t after current simulation time.\nevent!(sim, expr, every, Δt): schedule an expression for evaluation now and at every time step Δt until end of simulation.","category":"page"},{"location":"overview/#","page":"Overview","title":"Overview","text":"Events are evaluated later as we step or run through the simulation. They may then at runtime create further events and thus cause chains of events to be scheduled and called during simulation.","category":"page"},{"location":"overview/#Sampling-expressions-1","page":"Overview","title":"Sampling expressions","text":"","category":"section"},{"location":"overview/#","page":"Overview","title":"Overview","text":"If we provide the clock with a time interval Δt, the clock ticks with a fixed sample rate. At each tick it will evaluate expressions, we register with:","category":"page"},{"location":"overview/#","page":"Overview","title":"Overview","text":"sample!(sim::Clock, expr::Expr): enqueue an expression for sampling.","category":"page"},{"location":"overview/#","page":"Overview","title":"Overview","text":"Sampling expressions are evaluated at clock ticks in the sequence they were registered. They are evaluated before any events which may have been scheduled for the same time.","category":"page"},{"location":"overview/#Running-the-simulation-1","page":"Overview","title":"Running the simulation","text":"","category":"section"},{"location":"overview/#","page":"Overview","title":"Overview","text":"Now, after we have setup a clock, scheduled expressions as events or registered them for sampling, we can step or run through a simulation, stop or resume it.","category":"page"},{"location":"overview/#","page":"Overview","title":"Overview","text":"run!(sim::Clock, duration::Number): run a simulation for a given duration. Call and evaluate all ticks and scheduled events in that timeframe.\nstep!(sim::Clock): take one simulation step, execute the next tick or event.\nstop!(sim::Clock): stop a simulation\nresume!(sim::Clock): resume a halted simulation.","category":"page"},{"location":"overview/#","page":"Overview","title":"Overview","text":"Now we can evaluate the results.","category":"page"},{"location":"overview/#Logging-1","page":"Overview","title":"Logging","text":"","category":"section"},{"location":"overview/#","page":"Overview","title":"Overview","text":"Logging enables us to trace variables over simulation time and such analyze their behaviour.","category":"page"},{"location":"overview/#","page":"Overview","title":"Overview","text":"L = Logger(): create a new logger, providing the newest record L.last, a logging table L.df and a switch L.ltype between logging types.\ninit!(L::Logger, sim::Clock):\nsetup!(L::Logger, vars::Array{Symbol}): setup L, providing it with an array of logging variables [:a, :b, :c ...]\nswitch!(L::Logger, to::Number=0): switch between 0: only keep the last record, 1: print, 2: write records to the table\nrecord!(L::Logger): record the logging variables with current simulation time.","category":"page"},{"location":"#Sim.jl-1","page":"Home","title":"Sim.jl","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"A Julia package for discrete event simulation.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Sim.jl introduces a Clock and allows to schedule and evaluate arbitrary Julia expressions at their scheduled time or at each tick.","category":"page"},{"location":"#Installation-1","page":"Home","title":"Installation","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Sim.jl is not yet an registered package and is installed with","category":"page"},{"location":"#","page":"Home","title":"Home","text":"pkg> add(\"https://github.com/pbayer/Sim.jl\")","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Author: Paul Bayer License: MIT","category":"page"},{"location":"internals/#Internals-1","page":"Internals","title":"Internals","text":"","category":"section"},{"location":"internals/#","page":"Internals","title":"Internals","text":"CurrentModule = Sim","category":"page"},{"location":"internals/#Module-1","page":"Internals","title":"Module","text":"","category":"section"},{"location":"internals/#","page":"Internals","title":"Internals","text":"Sim","category":"page"},{"location":"internals/#Sim.Sim","page":"Internals","title":"Sim.Sim","text":"Sim\n\nA Julia package for discrete event simulation based on state machines.\n\n\n\n\n\n","category":"module"},{"location":"internals/#","page":"Internals","title":"Internals","text":"The module contains two main types: Clock and Logger. Both are implemented as state machines. The implementation functions and types are not exported. The exported functions documented above under Usage are commands to the internal state machines.","category":"page"},{"location":"internals/#State-machines-1","page":"Internals","title":"State machines","text":"","category":"section"},{"location":"internals/#","page":"Internals","title":"Internals","text":"We have some definitions for them to work.","category":"page"},{"location":"internals/#","page":"Internals","title":"Internals","text":"SEngine","category":"page"},{"location":"internals/#Sim.SEngine","page":"Internals","title":"Sim.SEngine","text":"supertype for state machines in Sim.jl\n\n\n\n\n\n","category":"type"},{"location":"internals/#States-1","page":"Internals","title":"States","text":"","category":"section"},{"location":"internals/#","page":"Internals","title":"Internals","text":"Defined states for state machines.","category":"page"},{"location":"internals/#","page":"Internals","title":"Internals","text":"SState\nUndefined\nIdle\nEmpty\nBusy\nHalted","category":"page"},{"location":"internals/#Sim.SState","page":"Internals","title":"Sim.SState","text":"supertype for states\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Undefined","page":"Internals","title":"Sim.Undefined","text":"a state machine is undefined (after creation)\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Idle","page":"Internals","title":"Sim.Idle","text":"a state machine is idle\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Empty","page":"Internals","title":"Sim.Empty","text":"a state machine is empty\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Busy","page":"Internals","title":"Sim.Busy","text":"a state machine is busy\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Halted","page":"Internals","title":"Sim.Halted","text":"a state machine is halted\n\n\n\n\n\n","category":"type"},{"location":"internals/#Events-1","page":"Internals","title":"Events","text":"","category":"section"},{"location":"internals/#","page":"Internals","title":"Internals","text":"Defined events.","category":"page"},{"location":"internals/#","page":"Internals","title":"Internals","text":"SEvent\nInit\nSetup\nSwitch\nLog\nStep\nRun\nStart\nStop\nResume\nClear","category":"page"},{"location":"internals/#Sim.SEvent","page":"Internals","title":"Sim.SEvent","text":"supertype for transitions.\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Init","page":"Internals","title":"Sim.Init","text":"Init(info): Init event with some info.\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Setup","page":"Internals","title":"Sim.Setup","text":"Setup(vars::Array{Symbol,1}): setup a logger with an array of symbols\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Switch","page":"Internals","title":"Sim.Switch","text":"Switch(to): switch event with some info\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Log","page":"Internals","title":"Sim.Log","text":"Log(): record command for logging\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Step","page":"Internals","title":"Sim.Step","text":"Step(): command\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Run","page":"Internals","title":"Sim.Run","text":"Run(): command\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Start","page":"Internals","title":"Sim.Start","text":"Start(): command\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Stop","page":"Internals","title":"Sim.Stop","text":"Stop(): command\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Resume","page":"Internals","title":"Sim.Resume","text":"Resume(): command\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Clear","page":"Internals","title":"Sim.Clear","text":"Clear(): command\n\n\n\n\n\n","category":"type"},{"location":"internals/#Transition-functions-1","page":"Internals","title":"Transition functions","text":"","category":"section"},{"location":"internals/#","page":"Internals","title":"Internals","text":"In state machines transitions occur depending on states and events. The different transitions are described through different methods of the step!-function.","category":"page"},{"location":"internals/#","page":"Internals","title":"Internals","text":"step!","category":"page"},{"location":"internals/#Sim.step!","page":"Internals","title":"Sim.step!","text":"step!(A::SEngine, q::SState, σ::SEvent)\n\nDefault transition for clock and logger.\n\nThis is called if no otherwise defined transition occurs.\n\nArguments\n\nA::SEngine: state machine for which a transition is called\nq::SState:  state of the state machine\nσ::SEvent:  event, triggering the transition\n\n\n\n\n\nstep!(sim::Clock, ::Undefined, ::Init)\n\ninitialize, startup logger.\n\n\n\n\n\nstep!(sim::Clock, ::Undefined, σ::Union{Step,Run})\n\nif uninitialized, initialize and then Step or Run.\n\n\n\n\n\nstep!(sim::Clock, ::Union{Idle,Busy,Halted}, ::Step)\n\nstep forward to next tick or scheduled event.\n\nAt a tick evaluate all sampling expressions, or, if an event is encountered evaluate the event expression.\n\n\n\n\n\nstep!(sim::Clock, ::Idle, σ::Run)\n\nRun a simulation for a given duration.\n\nThe duration is given with Run(duration). Call scheduled events and evaluate sampling expressions at each tick in that timeframe.\n\n\n\n\n\nstep!(sim::Clock, ::Busy, ::Stop)\n\nStop the clock.\n\n\n\n\n\nstep!(sim::Clock, ::Halted, ::Resume)\n\nResume a halted clock.\n\n\n\n\n\nstep!(A::Logger, ::Undefined, σ::Init)\n\nInitialize a logger.\n\n\n\n\n\nstep!(A::Logger, ::Empty, σ::Setup)\n\nSetup a logger with logging variables. They are given by Setup(vars).\n\n\n\n\n\nstep!(A::Logger, ::Idle, ::Clear)\n\nClear the last record and the data table of a logger.\n\n\n\n\n\nstep!(A::Logger, ::Idle, σ::Log)\n\nLogging event.\n\n\n\n\n\nstep!(A::Logger, ::Idle, σ::Switch)\n\nSwitch the operating mode of a logger by Switch(to).\n\nto = 0: no output, to = 1: print, `to = 2: store in log table\"\n\n\n\n\n\n","category":"function"},{"location":"internals/#Other-internal-types-and-functions-1","page":"Internals","title":"Other internal types and functions","text":"","category":"section"},{"location":"internals/#","page":"Internals","title":"Internals","text":"SimEvent\nSample\nnextevent\nnextevtime","category":"page"},{"location":"internals/#Sim.SimEvent","page":"Internals","title":"Sim.SimEvent","text":"SimEvent(expr::Expr, scope::Module, t::Float64, Δt::Float64)\n\nCreate a simulation event: an expression to be executed at an event time.\n\nArguments\n\nexpr::Expr: expression to be evaluated at event time\nscope::Module: evaluation scope\nt::Float64: event time\nΔt::Float64: repeat rate with which the event gets repeated\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.Sample","page":"Internals","title":"Sim.Sample","text":"Sample(expr::Expr, scope::Module)\n\nCreate a sampling expression.\n\nArguments\n\nexpr::Expr: expression to be evaluated at sample time\nscope::Module: evaluation scope\n\n\n\n\n\n","category":"type"},{"location":"internals/#Sim.nextevent","page":"Internals","title":"Sim.nextevent","text":"nextevent(sim::Clock)\n\nReturn the next scheduled event.\n\n\n\n\n\n","category":"function"},{"location":"internals/#Sim.nextevtime","page":"Internals","title":"Sim.nextevtime","text":"nextevtime(sim::Clock)\n\nReturn the time of next scheduled event.\n\n\n\n\n\n","category":"function"}]
}
