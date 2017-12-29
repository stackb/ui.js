package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library", "closure_js_test", "closure_js_binary")

closure_js_library(
    name = "ui",
    srcs = [
        "api/event.js",
        "app.js",
        "history.js",
        "history/event.js",
        "select.js",
        "tabs.js",        
        "router.js",
        "keyboard.js",
        "body.js",
        "template.js",
        "home.js",
        "menu.js",
        "list.js",
    ],
    deps = [
        ":component",
        "//soy",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/protobuf:jspb",
    ],
    #suppress = ["JSC_QUALIFIED_REFERENCE_TO_GOOG_MODULE",],
)

closure_js_library(
    name = "main",
    srcs = [
        "main.js",
    ],
    deps = [
        ":ui",
        "//soy",
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_binary(
    name = "application",
    compilation_level = "ADVANCED",
    css = "//css",
    debug = True,
    entry_points = ["goog:js.ui.main"],
    output_wrapper = "(function(){%output%}).call(this);",
    deps = [
        ":main",
    ],
)

closure_js_library(
    name = "component",
    srcs = [
        "component.js",
        "route.js",
        "route/event.js",
    ],
    deps = [
        "@io_bazel_rules_closure//closure/library",
    ],
)

closure_js_test(
    name = "component_test",
    entry_points = ["goog:js.ui.ComponentTest"],
    srcs = [
        "component_test.js",
    ],
    deps = [
        ":component",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
)

closure_js_test(
    name = "route_test",
    entry_points = ["goog:js.ui.RouteTest"],
    srcs = [
        "route_test.js",
    ],
    deps = [
        ":component",
        ":ui",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
    suppress = [
        "reportUnknownTypes",
    ],
)

closure_js_test(
    name = "select_test",
    entry_points = ["goog:js.ui.SelectTest"],
    srcs = [
        "select_test.js",
    ],
    deps = [
        ":component",
        ":ui",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
)

closure_js_test(
    name = "history_test",
    entry_points = ["goog:js.ui.HistoryTest"],
    srcs = [
        "history_test.js",
    ],
    deps = [
        ":ui",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
)
