import { Aspects, Construct, Stack, StackProps } from '@aws-cdk/core';
import { IdMap, LogicalIdMapper } from './LogicalIdMapper';
import { SomeConstruct } from './main';


interface MyStackProps extends StackProps {
  idMap?: IdMap;
}

export class OriginalStack extends Stack {
  constructor(scope: Construct, id: string, props: MyStackProps) {
    super(scope, id, props);

    new SomeConstruct(this, 'Thingy');

    // if an idMap was provided, add the aspect.
    if (props.idMap) {
      Aspects.of(this).add(new LogicalIdMapper(props.idMap));
    }
  }
}