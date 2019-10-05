package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_binary", "closure_js_library", "closure_js_test")

closure_js_library(
    name = "component",
    srcs = [
        "component.js",
    ],
    deps = [
        "@io_bazel_rules_closure//closure/library/asserts",
        "@io_bazel_rules_closure//closure/library/fx:dom",
        "@io_bazel_rules_closure//closure/library/fx:easing",
        "@io_bazel_rules_closure//closure/library/string",
        "@io_bazel_rules_closure//closure/library/style",
        "@io_bazel_rules_closure//closure/library/ui:component",
    ],
)

closure_js_library(
    name = "history",
    srcs = [
        "history.js",
        "history/event.js",
    ],
    deps = [
        "@io_bazel_rules_closure//closure/library/asserts",
        "@io_bazel_rules_closure//closure/library/dom",
        "@io_bazel_rules_closure//closure/library/dom:tagname",
        "@io_bazel_rules_closure//closure/library/events",
        "@io_bazel_rules_closure//closure/library/events:event",
        "@io_bazel_rules_closure//closure/library/events:eventtarget",
        "@io_bazel_rules_closure//closure/library/events:eventtype",
        "@io_bazel_rules_closure//closure/library/history:eventtype",
        "@io_bazel_rules_closure//closure/library/history:html5history",
        "@io_bazel_rules_closure//closure/library/string",
    ],
)

closure_js_library(
    name = "routing",
    srcs = [
        "route.js",
        "route/event.js",
        "router.js",
    ],
    deps = [
        ":component",
        ":history",
        "@io_bazel_rules_closure//closure/library/asserts",
        "@io_bazel_rules_closure//closure/library/promise",
        "@io_bazel_rules_closure//closure/library/events:event",
        "@io_bazel_rules_closure//closure/library/events:eventhandler",
        "@io_bazel_rules_closure//closure/library/events:eventtarget",
        "@io_bazel_rules_closure//closure/library/ui:component",
        # "@io_bazel_rules_closure//closure/library/ui:all_js",
        # "@io_bazel_rules_closure//closure/protobuf:jspb",
    ],
)

closure_js_library(
    name = "keyboard",
    srcs = [
        "keyboard.js",
    ],
    deps = [
        "@io_bazel_rules_closure//closure/library/disposable",
        "@io_bazel_rules_closure//closure/library/events",
        "@io_bazel_rules_closure//closure/library/object",
        "@io_bazel_rules_closure//closure/library/ui:keyboardshortcuthandler",
    ],
)

closure_js_library(
    name = "template",
    srcs = [
        "template.js",
    ],
    deps = [
        ":component",
        "@io_bazel_rules_closure//closure/library/soy",
    ],
)

closure_js_library(
    name = "select",
    srcs = [
        "select.js",
        "tab.js",
        "tabevent.js",
        "tabs.js",
    ],
    deps = [
        ":component",
        "@io_bazel_rules_closure//closure/library/asserts",
        "@io_bazel_rules_closure//closure/library/dom",
        "@io_bazel_rules_closure//closure/library/dom:classlist",
        "@io_bazel_rules_closure//closure/library/dom:dataset",
        "@io_bazel_rules_closure//closure/library/dom:tagname",
        "@io_bazel_rules_closure//closure/library/events:event",
    ],
)

closure_js_library(
    name = "menushield",
    srcs = [
        "menushield.js",
    ],
    deps = [
        "@io_bazel_rules_closure//closure/library/asserts",
        "@io_bazel_rules_closure//closure/library/dom",
        "@io_bazel_rules_closure//closure/library/math:coordinate",
        "@io_bazel_rules_closure//closure/library/style",
        "@io_bazel_rules_closure//closure/library/ui:component",
        "@io_bazel_rules_closure//closure/library/ui:menu",
        "@io_bazel_rules_closure//closure/library/ui:menubutton",
        "@io_bazel_rules_closure//closure/library/ui:submenu",
    ],
)

closure_js_library(
    name = "syntax",
    srcs = [
        "markdown.js",
        "syntax.js",
    ],
    deps = [
        ":component",
        "@io_bazel_rules_closure//closure/library/asserts",
        "@io_bazel_rules_closure//closure/library/dom",
    ],
)

closure_js_library(
    name = "ui",
    srcs = [
        "app.js",
        "injector.js",
    ],
    deps = [
        ":component",
        ":history",
        ":keyboard",
        ":menushield",
        ":routing",
        ":select",
        ":syntax",
        ":template",
        "@io_bazel_rules_closure//closure/library/asserts",
        "@io_bazel_rules_closure//closure/library/dom",
        "@io_bazel_rules_closure//closure/library/history:eventtype",
        "@io_bazel_rules_closure//closure/library/object",
        "@io_bazel_rules_closure//closure/library/promise",
    ],
)

closure_js_test(
    name = "component_test",
    srcs = [
        "component_test.js",
    ],
    entry_points = ["goog:stack.ui.ComponentTest"],
    deps = [
        ":ui",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
)

closure_js_test(
    name = "route_test",
    srcs = [
        "route_test.js",
    ],
    entry_points = ["goog:stack.ui.RouteTest"],
    suppress = [
        "reportUnknownTypes",
    ],
    deps = [
        ":ui",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
)

closure_js_test(
    name = "select_test",
    srcs = [
        "select_test.js",
    ],
    entry_points = ["goog:stack.ui.SelectTest"],
    deps = [
        ":ui",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
)

closure_js_test(
    name = "history_test",
    srcs = [
        "history_test.js",
    ],
    entry_points = ["goog:stack.ui.HistoryTest"],
    deps = [
        ":ui",
        "@io_bazel_rules_closure//closure/library",
        "@io_bazel_rules_closure//closure/library:testing",
    ],
)
