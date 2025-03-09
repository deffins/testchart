let pathsData = [];

function savePath(pathID, pathData) {
    pathsData.push({ id: pathID, data: pathData });
    localStorage.setItem('pathsData', JSON.stringify(pathsData));
}

function loadPaths() {
    clearAllSelectedRects(); // Notīra visus atlasītos taisnstūrus
    let savedPaths = localStorage.getItem('pathsData');
    if (savedPaths) {
        pathsData = JSON.parse(savedPaths);
        pathsData.forEach(path => {
            // Atjauno ceļu diagrammā
            let pathElement = Snap.select("#" + path.id);
            if (pathElement) {
                pathElement.attr(path.data);
            }
        });
    }
}

function modifyPath(pathID, newPathData) {
    let path = pathsData.find(p => p.id === pathID);
    if (path) {
        path.data = newPathData;
        localStorage.setItem('pathsData', JSON.stringify(pathsData));
        let pathElement = Snap.select("#" + pathID);
        if (pathElement) {
            pathElement.attr(newPathData);
        }
    }
}

function saveSelectedRects(selectedRects) {
    localStorage.setItem('selectedRects', JSON.stringify(selectedRects));
}

function loadSelectedRects() {
    let savedRects = localStorage.getItem('selectedRects');
    return savedRects ? JSON.parse(savedRects) : [];
}

function clearAllSelectedRects() {
    this.selectedRectArray.forEach(rectID => {
        clickOnRect(rectID, true); // Pievienojiet otro parametru, lai norādītu, ka nevajag saglabāt
    });
    this.selectedRectArray = [];
}

export { savePath, loadPaths, modifyPath };