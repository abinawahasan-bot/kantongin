export type HowFlow = "brand" | "creator";

export const HOW_FLOW_ANCHORS = ["#affiliate", "#creators"] as const;

export const FLOW_BY_ANCHOR: Record<(typeof HOW_FLOW_ANCHORS)[number], HowFlow> = {
  "#affiliate": "brand",
  "#creators": "creator",
};

export const HOW_TAB_EVENT = "kantongin:how-tab";

export function isHowFlowAnchor(
  href: string
): href is (typeof HOW_FLOW_ANCHORS)[number] {
  return (HOW_FLOW_ANCHORS as readonly string[]).includes(href);
}

export function flowForAnchor(href: string): HowFlow | null {
  return isHowFlowAnchor(href) ? FLOW_BY_ANCHOR[href] : null;
}

let requestedFlow: HowFlow | null = null;

export function requestFlow(flow: HowFlow): void {
  requestedFlow = flow;
  window.dispatchEvent(new CustomEvent<HowFlow>(HOW_TAB_EVENT, { detail: flow }));
}

export function consumeRequestedFlow(): HowFlow | null {
  const flow = requestedFlow;
  requestedFlow = null;
  return flow;
}

export function switchHowFlow(href: string): void {
  const flow = flowForAnchor(href);
  if (!flow) return;
  requestFlow(flow);
}
