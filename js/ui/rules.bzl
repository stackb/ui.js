def _node_module_filegroup_impl(ctx):

    files = []
    for dep in ctx.attr.deps:
        node_module = dep.node_module
        for src in node_module.files:
            included = True
            for inclusion in ctx.attr.include:
                if not src.path.endswith(inclusion):
                    included = False
            excluded = False
            for exclusion in ctx.attr.exclude:
                if src.path.endswith(exclusion):
                    excluded = True
            if included and not excluded:
                print("OK %s" % (src.short_path))
                files.append(src)

    #print("files: %s" % "\n".join(files))
    return struct(
        files = depset(files),
    )

node_module_filegroup = rule(
    implementation = _node_module_filegroup_impl,
    attrs = {
        "deps": attr.label_list(
            providers = ["node_module"],
            mandatory = True,
        ),
        "exclude": attr.string_list(
        ),
        "include": attr.string_list(
        ),
    },
)
