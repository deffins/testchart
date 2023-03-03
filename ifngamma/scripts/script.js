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
    }

    box.node.setAttribute("box-id", box.id);
    box.node.classList.add(box.id);

    return box;
}

function boxRelationsLabel(box) {
    box.area = {
        left: +box.node.getAttribute("x"),
        top: +box.node.getAttribute("y"),
    }
    box.area.bottom = box.area.top + +box.node.getAttribute("height");
    box.area.right = box.area.left + +box.node.getAttribute("width");

    let pathsAll = document.querySelectorAll("path");
    pathsAll.forEach(node => {
        let parts = node.getAttribute("d").split(" ");
        
        let startPoint = {
            left:   +parts[1],
            top:    +parts[2],
        }
        
        let endPoint = {
            left:   +parts[parts.length - 2],
            top:    +parts[parts.length - 1],
        }

        if (!areaContainsPoint(box.area, startPoint)) 
            return;
            
        let boxRelation = {
            box:        box,
            node:       node,
            points:     {
                start:      startPoint,
                end:        endPoint,
            },
        }

        boxRelationLabel(boxRelation);
        boxRelationEndsLabel(boxRelation);

    });
}

function boxRelationLabel(boxRelation) {
    boxRelation.node.classList.add("boxRelation");
    boxRelation.node.setAttribute("from-box-id", boxRelation.box.id);

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
    let pathsUnlabeled = document.querySelectorAll("path:not(.boxRelation)");
    pathsUnlabeled.forEach(node => {
        if (boxRelation.node === node) return;

        let parts = node.getAttribute("d").split(" ");
        let pathStartPoint = {
            left: +parts[1],
            top: +parts[2],
        }

        let rangeA = distanceBetweenPoints(boxRelation.points.start, pathStartPoint);
        let rangeB = distanceBetweenPoints(boxRelation.points.end, pathStartPoint);

        if (rangeA < 10) {
            boxRelation.start = {
                node:   node,
            }

            boxRelation.start.node.setAttribute("from-box-id", boxRelation.box.id);
            boxRelation.start.node.classList.add("boxRelation");
            boxRelation.start.node.classList.add("boxRelationStart");

            boxRelation.start.node.setAttribute("relation-type", boxRelation.relationType);
        }

        if (rangeB < 10) {
            boxRelation.end = {
                node:   node,
            }

            boxRelation.end.node.setAttribute("from-box-id", boxRelation.box.id);
            boxRelation.end.node.classList.add("boxRelation");
            boxRelation.end.node.classList.add("boxRelationEnd");

            boxRelation.end.node.setAttribute("relation-type", boxRelation.relationType);
        }
    });
}

function areaContainsPoint(area, point) {
    if (!(point.left <= area.right)) return false;
    if (!(point.left >= area.left)) return false;
    if (!(point.top >= area.top)) return false;
    if (!(point.top <= area.bottom)) return false;
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
    },

    boxUiCircleClick: function() {
        let boxUiCircle = this;
        let boxId = boxUiCircle.getAttribute("for-box-id");
        let box = document.querySelector(`.modelBox.${boxId}`);
        let boxRelationsOut = document.querySelectorAll(`.boxRelation[from-box-id=${boxId}]`);
        let boxRelationsIn = document.querySelectorAll(`.boxRelation[to-box-id=${boxId}]`);
        let highlightState = box.getAttribute("highlight-state") || "";

        highlightState = {
            "x":     "all",
            "":     "out",
            "out":  "in",
            "in":   "all",
            "all":  "",
        }[highlightState];

        box.setAttribute("highlight-state", highlightState);

        boxRelationsOut.forEach(node => {
            if (["out", "all"].includes(highlightState))
                node.setAttribute("highlight-state", highlightState);
            else
                node.setAttribute("highlight-state", "");
        });

        boxRelationsIn.forEach(node => {
            if (["in", "all"].includes(highlightState))
                node.setAttribute("highlight-state", highlightState);
            else
                node.setAttribute("highlight-state", "");
        });
    },
}

init();