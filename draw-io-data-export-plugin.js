/**
 * Sample plugin.
 */
Draw.loadPlugin(function (ui) {

    /**
     * Overrides SVG export to add metadata for each cell.
     */
    var graphCreateSvgImageExport = Graph.prototype.createSvgImageExport;

    Graph.prototype.createSvgImageExport = function () {
        var exp = graphCreateSvgImageExport.apply(this, arguments);

        // Overrides rendering to add metadata
        var expDrawCellState = exp.drawCellState;

        exp.drawCellState = function (state, canvas) {
            var svgDoc = canvas.root.ownerDocument;
            var g = (svgDoc.createElementNS != null) ?
                svgDoc.createElementNS(mxConstants.NS_SVG, 'g') : svgDoc.createElement('g');
            g.setAttribute('id', '' + state.cell.id);
            if (state.cell.value != undefined) {

                let string = state.cell.value.toLowerCase().trim().replace(/[^\x00-\x7F]/g, "").replaceAll('\n', " ").replaceAll(",", " ").replaceAll(">", " ").replaceAll("(", " ").replaceAll(")", " ").replaceAll("/", " ").replace(/  +/g, ' ').replaceAll(" ", "-").replaceAll("--", "-").replaceAll("--", "-").substring(0, 20)
                console.log(string);
                g.setAttribute('value', '' + string);

            }
            if (state.cell.source) {
                // console.log(state.cell.source);
                if (state.cell.source.id) {
                    g.setAttribute('source', '' + state.cell.source.id);
                }
                if (state.cell.target.id) {
                    g.setAttribute('target', '' + state.cell.target.id);
                }

            }

            // Temporary replaces root for content rendering
            var prev = canvas.root;
            prev.appendChild(g);
            canvas.root = g;

            expDrawCellState.apply(this, arguments);

            // Adds metadata if group is not empty
            if (g.firstChild == null) {
                g.parentNode.removeChild(g);
            }
            else if (mxUtils.isNode(state.cell.value)) {
                g.setAttribute('content', mxUtils.getXml(state.cell.value));

                for (var i = 0; i < state.cell.value.attributes.length; i++) {
                    var attrib = state.cell.value.attributes[i];
                    g.setAttribute('data-' + attrib.name, attrib.value);
                }
            }

            // Restores previous root
            canvas.root = prev;
        };

        return exp;
    };

});
