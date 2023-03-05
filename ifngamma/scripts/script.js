function init() {
    wireUpUI();
    svgInit();
}

function wireUpUI() {
    document.querySelector("#btn-reset").addEventListener("click", uiCallback.btnResetClick);
    document.querySelector("#btn-clear").addEventListener("click", uiCallback.btnClearClick);
}

function svgInit() {
    fixPointerEventsInSVG();

    var chartElement = document.querySelector("svg");
    chart = Snap(chartElement);
    chart.zpd();
    
    chart.mouseover((event) => {
        if (event.target.nodeName === "svg") {
            document.body.style.cursor = "move";
        } else if (event.target.nodeName === "rect") {
            document.body.style.cursor = "default";
        } else if (event.target.nodeName === "path") {
            document.body.style.cursor = "default";
        } else if (event.target.nodeName === "circle") {
            document.body.style.cursor = "pointer";
        }
    });

    // Mark model boxes
    document.querySelectorAll("g foreignObject > div").forEach(element => { 
        var associatedRect = element.parentElement.parentElement.parentElement.previousElementSibling;
        var width  = +associatedRect.getAttribute("width");
        var height = +associatedRect.getAttribute("height");
        if (width < 100 || width > 200) return;
        if (height < 40 || height > 80) return;
        associatedRect.classList.add("modelBox");
    });

    // Process model boxes
    document.querySelectorAll(".modelBox").forEach(node => {
        let box = boxLabel(node);
        boxRelationsLabel(box);
        boxUiCircleRender(box).addEventListener("click", uiCallback.boxUiCircleClick);

    });

}

function boxLabel(node) {
    box = {
        node:   node,
        id:     "box" + (document.querySelectorAll(".modelBox[box-id]").length + 1),
        area:   getBounds(node).area,
    }

    box.node.setAttribute("box-id", box.id);
    box.node.classList.add(box.id);

    return box;
}

function boxRelationsLabel(box) {
    let pathsAll = document.querySelectorAll("path");
    pathsAll.forEach(node => {
        let pathBounds = getPathBounds(node);

        if (pathBounds.area.size <= 64)
            return;

        let isFromRelation = areaContainsPoint(box.area, pathBounds.points.first);
        let isToRelation = areaContainsPoint(box.area, pathBounds.points.last, 10);

        if (!isFromRelation && !isToRelation)
            return;
            
        let boxRelation = {
            box:        box,
            node:       node,
            direction:  isFromRelation ? "from" : "to",
            points: {
                first:  pathBounds.points.first,
                last:   pathBounds.points.last,
            }
        }

        boxRelationLabel(boxRelation);
        boxRelationEndsLabel(boxRelation);
    });
}

function boxRelationLabel(boxRelation) {
    boxRelation.node.classList.add("boxRelation");

    boxRelation.node.setAttribute(`${boxRelation.direction}-box-id`, boxRelation.box.id);

    let stroke = boxRelation.node.getAttribute("stroke");
    let dashArray = boxRelation.node.getAttribute("stroke-dasharray");
    
    boxRelation.relationType = "";
    if (dashArray)
        boxRelation.relationType = "promotes-far";
    else if (stroke == "#000000")
        boxRelation.relationType = "promotes";
    else if (stroke == "#d6b656")
        boxRelation.relationType = "inhibits";

    boxRelation.node.setAttribute("relation-type", boxRelation.relationType);
}

function boxRelationEndsLabel(boxRelation) {
    let allPaths = document.querySelectorAll("path");
    allPaths.forEach(node => {
        if (boxRelation.node === node) return;

        let parts = node.getAttribute("d").split(" ");
        let pathStartPoint = {
            left: +parts[1],
            top: +parts[2],
        }

        let rangeA = distanceBetweenPoints(boxRelation.points.first, pathStartPoint);
        let rangeB = distanceBetweenPoints(boxRelation.points.last, pathStartPoint);

        if (rangeA < 10) {
            boxRelation.start = {
                node:   node,
            }

            boxRelation.start.node.setAttribute(`${boxRelation.direction}-box-id`, boxRelation.box.id);
            boxRelation.start.node.classList.add("boxRelation");
            boxRelation.start.node.classList.add("boxRelationStart");

            boxRelation.start.node.setAttribute("relation-type", boxRelation.relationType);
        }

        if (rangeB < 10) {
            boxRelation.end = {
                node:   node,
            }

            boxRelation.end.node.setAttribute(`${boxRelation.direction}-box-id`, boxRelation.box.id);
            boxRelation.end.node.classList.add("boxRelation");
            boxRelation.end.node.classList.add("boxRelationEnd");

            boxRelation.end.node.setAttribute("relation-type", boxRelation.relationType);
        }
    });
}

function getBounds(node) {
    let bounds = {
        area:   node.getBBox(),
    };

    // Hack to fix zero width or height paths
    if (bounds.area.width === 0) bounds.area.width = 1;
    if (bounds.area.height === 0) bounds.area.height = 1;

    bounds.area.left    = bounds.area.x;
    bounds.area.top     = bounds.area.y;
    bounds.area.right   = bounds.area.left + bounds.area.width;
    bounds.area.bottom   = bounds.area.top + bounds.area.height;

    bounds.area.size = bounds.area.width * bounds.area.height;

    return bounds;
}

function getPathBounds(node) {
    let parts = node.getAttribute("d").split(" ");

    let bounds = getBounds(node);

    bounds.points =  {
        first: {
            left:   parts[1],
            top:    parts[2],
        },
        last: {
            left:   parts[parts.length - 2],
            top:    parts[parts.length - 1],
        }
    };

    return bounds;
}

function areaContainsPoint(area, point, pad) {
    pad |= 0;
    if (!(point.left <= area.right + pad)) return false;
    if (!(point.left >= area.left - pad)) return false;
    if (!(point.top >= area.top - pad)) return false;
    if (!(point.top <= area.bottom + pad)) return false;
    return true;
}

function distanceBetweenPoints(pointA, pointB) {
    let a = pointA.left - pointB.left;
    let b = pointA.top - pointB.top;
    
    return Math.hypot(a, b);
}


function boxUiCircleRender(box) {
    let uiCirclePos = {
        left:   +box.node.getAttribute("x") - 3,
        top:    +box.node.getAttribute("y") - 3,
    }
    let uiCircle = Snap(box.node.parentElement).circle(uiCirclePos.left, uiCirclePos.top, 12).node;
    uiCircle.classList.add("box-ui-circle");
    uiCircle.setAttribute("for-box-id", box.id);
    box.node.after(uiCircle);

    return uiCircle;
}

function fixPointerEventsInSVG() {
    let rects = document.querySelectorAll("rect");
    rects.forEach(rect => {
        let pointerEvents = rect.getAttribute("pointer-events");
        if (pointerEvents == "none") {
            rect.setAttribute("pointer-events", "all");
        }
    });

    let divs = document.querySelectorAll("div");
    divs.forEach(div => {
        let pointerEventValue = div.style.getPropertyValue("pointer-events");
        if (pointerEventValue == "all") {
            div.style.setProperty("pointer-events", "none");
        }
    });

};

// |||||||||||||||| UI CALLBACKS ||||||||||||||||||
let uiCallback = {
    btnResetClick: function() {
        uiCallback.btnClearClick();
    },

    btnClearClick: function() {
        document.querySelectorAll("[highlight-state]").forEach(node => {
            node.removeAttribute("highlight-state");
        });
        document.querySelectorAll(".highlight-from,.highlight-to").forEach(node => {
            node.classList.remove("highlight-from");
            node.classList.remove("highlight-to");
        });
    },

    boxUiCircleClick: function() {
        let boxUiCircle = this;
        let boxId = boxUiCircle.getAttribute("for-box-id");
        let box = document.querySelector(`.modelBox.${boxId}`);
        let boxRelationsFrom = document.querySelectorAll(`.boxRelation[from-box-id=${boxId}]`);
        let boxRelationsTo = document.querySelectorAll(`.boxRelation[to-box-id=${boxId}]`);
        let highlightState = box.getAttribute("highlight-state") || "";

        highlightState = {
            "":     "all",
            /* Multimodal seems unnecessary
            "":     "from",
            "from":  "to",
            "to":   "all",*/
            "all":  "",
        }[highlightState];

        box.setAttribute("highlight-state", highlightState);

        boxRelationsFrom.forEach(node => {
            if (["from", "all"].includes(highlightState))
                node.classList.add("highlight-from");
            else
                node.classList.remove("highlight-from");
        });

        boxRelationsTo.forEach(node => {
            if (["to", "all"].includes(highlightState))
                node.classList.add("highlight-to");
            else
                node.classList.remove("highlight-to");
        });
    },
}

init();