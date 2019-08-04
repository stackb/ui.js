package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library", "closure_js_test", "closure_js_binary")

closure_js_library(
    name = "ui",
    srcs = [
        "app.js",
        "history.js",
        "history/event.js",
        "select.js",
        "menushield.js",
        "tab.js",      
        "tabevent.js",      
        "tabs.js",      
        "injector.js",  
        "router.js",
        "keyboard.js",
        "template.js",
        "syntax.js",
        "markdown.js",
        "component.js",
        "route.js",
        "route/event.js",
    ],
    deps = [
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library/ui:all_js",
        "@io_bazel_rules_closure//closure/protobuf:jspb",
    ],
    #suppress = ["JSC_QUALIFIED_REFERENCE_TO_GOOG_MODULE",],
)

closure_js_test(
    name = "component_test",
    entry_points = ["goog:stack.ui.ComponentTest"],
    srcs = [
        "component_test.js",
    ],
    deps = [
        ":ui",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
)

closure_js_test(
    name = "route_test",
    entry_points = ["goog:stack.ui.RouteTest"],
    srcs = [
        "route_test.js",
    ],
    deps = [
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
    entry_points = ["goog:stack.ui.SelectTest"],
    srcs = [
        "select_test.js",
    ],
    deps = [
        ":ui",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
)

closure_js_test(
    name = "history_test",
    entry_points = ["goog:stack.ui.HistoryTest"],
    srcs = [
        "history_test.js",
    ],
    deps = [
        ":ui",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
)
