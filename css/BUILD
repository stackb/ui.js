package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_css_library", "closure_css_binary")

closure_css_binary(
    name = "css",
    renaming = True,
    deps = [
        ":main",
    ],
    visibility = ["//visibility:public"],
)

closure_css_library(
    name = "main",
    srcs = [
        "main.css",
    ],
)
