using Documenter, DiscreteEvents

x = 2 # set global (Main) variable for mocking fclosure.jl doctest line 90 

makedocs(
    modules = [DiscreteEvents],
    format = Documenter.HTML(prettyurls = get(ENV, "CI", nothing) == "true"),
    sitename = "DiscreteEvents.jl",
    authors  = "Paul Bayer",
    pages = [
        "Home" => "index.md",
        "News" => "news.md",
        "Manual" => [
            "intro.md",
            "usage.md",
            "internals.md",
            "troubleshooting.md",
            "history.md"]
    ]
)

deploydocs(
    repo   = "github.com/pbayer/DiscreteEvents.jl.git",
    target = "build",
    deps   = nothing,
    make   = nothing,
    devbranch = "master",
    devurl = "dev",
    versions = ["stable" => "v^", "v#.#", "dev" => "dev"]
)
