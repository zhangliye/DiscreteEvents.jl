# Internals

```@meta
CurrentModule = DiscreteEvents
```

The following types are handled internally by `DiscreteEvents.jl`. But they maybe interesting
for analyzing and debugging clocks and event schedules.

## Events

```@docs
AbstractEvent
DiscreteEvent
DiscreteCond
Sample
ClockException
```

## Clock

`ActiveClock`s are internal since the should not be setup explicitly.

```@docs
AbstractClock
ActiveClock
Schedule
ClockChannel
```
