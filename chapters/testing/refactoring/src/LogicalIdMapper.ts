import { CfnElement, CfnResource, IAspect, IConstruct, Stack } from '@aws-cdk/core';

export interface IdMap {
  [key: string]: string;
}

export class LogicalIdMapper implements IAspect {
  constructor(private idMap: IdMap) {
  }

  visit(node: IConstruct): void {
    const currentLogicalId = Stack.of(node).getLogicalId(node as CfnElement);
    // is there a map for this logicalId?
    if (!!this.idMap[currentLogicalId]) {
      // if we're on a L1 resource, try to do the override directly
      if ((node as CfnResource).overrideLogicalId) return (node as CfnResource).overrideLogicalId(this.idMap[currentLogicalId]);

    }
  }
}