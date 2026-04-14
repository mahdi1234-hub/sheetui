declare module "react-cytoscapejs" {
  import { Component } from "react";
  import cytoscape from "cytoscape";

  interface CytoscapeComponentProps {
    elements: cytoscape.ElementDefinition[];
    stylesheet?: cytoscape.Stylesheet[];
    style?: React.CSSProperties;
    cy?: (cy: cytoscape.Core) => void;
    layout?: cytoscape.LayoutOptions;
    userZoomingEnabled?: boolean;
    userPanningEnabled?: boolean;
    boxSelectionEnabled?: boolean;
    autoungrabify?: boolean;
    [key: string]: unknown;
  }

  export default class CytoscapeComponent extends Component<CytoscapeComponentProps> {}
}
