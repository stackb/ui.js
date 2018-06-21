workspace(name = "com_github_stackb_ui_js")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# ================================================================

RULES_CLOSURE_VERSION = "f4d0633f14570313b94822223039ebda0f398102"

http_archive(
    name = "io_bazel_rules_closure",
    url = "https://github.com/bazelbuild/rules_closure/archive/%s.zip" % RULES_CLOSURE_VERSION,
    strip_prefix = "rules_closure-%s" % RULES_CLOSURE_VERSION,
)

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_repositories")

closure_repositories()
