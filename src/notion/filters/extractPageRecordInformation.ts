import * as util from 'util';
import * as _ from 'lodash';
import '../types';

export default function extractPageRecordInformation(
  inputs: JsonArray,
): PageRecordInformation[] {
  const records: PageRecordInformation[] = [];
  console.log(
    '>debug>',
    util.inspect(inputs, {
      colors: true,
      depth: null,
    }),
  );
  inputs.forEach((input: JsonTypes) => {
    const value = _.get(input, 'value', null);
    if (!value) {
      throw new Error(
        `could not find value in record: ${JSON.stringify(input, null, 0)}`,
      );
    }
    const record: PageRecordInformation = {
      id: _.get(value, 'id', ''),
      title: _.get(value, 'properties.title', ''), // TODO : parse
      version: _.get(value, 'version', 0),
      createdTime: `${_.get(value, 'created_time', '')}`,
      lastEditedTime: `${_.get(value, 'last_edited_time', '')}`,
      contentIds: _.get(value, 'content', []),
    };
    records.push(record);
  });
  return records;
}
