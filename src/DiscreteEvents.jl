#
# This file is part of the DiscreteEvents.jl Julia package, MIT license
#
# Paul Bayer, 2019
#
# This is a Julia package for discrete event simulation
#

"""
    DiscreteEvents

A Julia package for generating and simulating discrete events. It runs on Julia
`VERSION ≥ v"1.0"`. Multithreading requires `VERSION ≥ v"1.3"`.

The current stable, registered version is installed with
```julia
pkg> add DiscreteEvents
```

The development version is installed with:
```julia
pkg> add("https://github.com/pbayer/DiscreteEvents.jl")
```
"""
module DiscreteEvents

"""
    version

Gives the package version:

```jldoctest
julia> using DiscreteEvents

julia> DiscreteEvents.version
v"0.3.0"
```
"""
const version = v"0.3.0"

using Unitful, Random, DataStructures, Logging, .Threads
import Unitful: FreeUnits, Time

include("types.jl")
include("components.jl")
include("fclosure.jl")
include("schedule.jl")
include("events.jl")
include("clock.jl")
include("process.jl")
include("threads.jl")
include("timer.jl")
include("printing.jl")
include("resources.jl")

export  Clock, PClock, RTClock, RTC, setUnit!, 𝐶,
        Action, Timing, at, after, every, before, until,
        tau, sample_time!, fun, event!, periodic!,
        incr!, run!, stop!, resume!, sync!, resetClock!, 
        Prc, process!, interrupt!, delay!, wait!, now!,
        fork!, collapse!, pclock, diagnose, onthread,
        Resource


Random.seed!(123)
rng = MersenneTwister(2020)
𝐶.state == Undefined() ? init!(𝐶) : nothing

end # module
