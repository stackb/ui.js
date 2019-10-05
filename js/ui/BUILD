package(default_visibility = ["//visibility:public"])

load("@io_bazel_rules_closure//closure:defs.bzl", "closure_js_library", "closure_js_test", "closure_js_binary")

closure_js_library(
    name = "component",
    srcs = [
        "component.js",
    ],
    deps = [
        "@io_bazel_rules_closure//closure/library/asserts",
        "@io_bazel_rules_closure//closure/library/string",
        "@io_bazel_rules_closure//closure/library/style",
        "@io_bazel_rules_closure//closure/library/fx:easing",
        "@io_bazel_rules_closure//closure/library/fx:dom",
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
        "@io_bazel_rules_closure//closure/library/string",
        "@io_bazel_rules_closure//closure/library/dom",
        "@io_bazel_rules_closure//closure/library/history:eventtype",
        "@io_bazel_rules_closure//closure/library/history:html5history",
        "@io_bazel_rules_closure//closure/library/dom:tagname",
        "@io_bazel_rules_closure//closure/library/events",
        "@io_bazel_rules_closure//closure/library/events:event",
        "@io_bazel_rules_closure//closure/library/events:eventtype",
        "@io_bazel_rules_closure//closure/library/events:eventtarget",
    ],
)

closure_js_library(
    name = "routing",
    srcs = [
        "router.js",
        "route.js",
        "route/event.js",
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
        "@io_bazel_rules_closure//closure/library/object",
        "@io_bazel_rules_closure//closure/library/events",
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
        "tabevent.js",      
        "tab.js",      
        "tabs.js",      
    ],
    deps = [
        ":component",
        "@io_bazel_rules_closure//closure/library/asserts",
        "@io_bazel_rules_closure//closure/library/events:event",
        "@io_bazel_rules_closure//closure/library/dom",
        "@io_bazel_rules_closure//closure/library/dom:tagname",
        "@io_bazel_rules_closure//closure/library/dom:classlist",
        "@io_bazel_rules_closure//closure/library/dom:dataset",
    ],
)

closure_js_library(
    name = "menushield",
    srcs = [
        "menushield.js",
    ],
    deps = [
        "@io_bazel_rules_closure//closure/library/asserts",
        "@io_bazel_rules_closure//closure/library/ui:component",
        "@io_bazel_rules_closure//closure/library/dom",
        "@io_bazel_rules_closure//closure/library/style",
        "@io_bazel_rules_closure//closure/library/ui:menubutton",
        "@io_bazel_rules_closure//closure/library/ui:submenu",
        "@io_bazel_rules_closure//closure/library/ui:menu",
        "@io_bazel_rules_closure//closure/library/math:coordinate",
    ],
)


closure_js_library(
    name = "syntax",
    srcs = [
        "syntax.js",
        "markdown.js",      
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
        ":template",
        ":keyboard",
        ":history",
        ":routing",
        ":select",
        ":menushield",
        ":syntax",
        "@io_bazel_rules_closure//closure/library/dom",
        "@io_bazel_rules_closure//closure/library/history:eventtype",
        "@io_bazel_rules_closure//closure/library/promise",
        "@io_bazel_rules_closure//closure/library/asserts",
        "@io_bazel_rules_closure//closure/library/object",
    ],
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
