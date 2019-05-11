workspace(name = "com_github_stackb_ui_js")

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

# ================================================================

http_archive(
    name = "io_bazel_rules_closure",
    urls = ["https://github.com/bazelbuild/rules_closure/archive/ad75d7cc1cff0e845cd83683881915d995bd75b2.tar.gz"],
    strip_prefix = "rules_closure-ad75d7cc1cff0e845cd83683881915d995bd75b2",
    sha256 = "bdb00831682cd0923df36e19b01619b8230896d582f16304a937d8dc8270b1b6",
)

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_repositories")

closure_repositories()
