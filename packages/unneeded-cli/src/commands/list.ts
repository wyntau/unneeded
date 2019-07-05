import { Command, flags } from '@oclif/command';
import { unneeded } from '@unneeded/unneeded';

export default class List extends Command {
  public static description = 'describe the command here';

  public static examples = [
    `$ unneeded list
list world from ./src/list.ts!
`,
  ];

  public static flags = {
    help: flags.help({ char: 'h' }),
    entry: flags.string({
      char: 'e',
      description: 'entry file',
      multiple: true,
      required: true,
    }),
    audit: flags.string({
      char: 'a',
      description: 'directory to audit',
      multiple: true,
      required: true,
    }),
    context: flags.string({
      char: 'c',
      description: 'context',
      default: process.cwd(),
    }),
  };

  public static args = [{ name: 'file' }];

  public async run() {
    const { flags } = this.parse(List);

    const unneededFiles = await unneeded({
      entry: flags.entry,
      audit: flags.audit,
    });

    unneededFiles.forEach(item => console.log(item));
  }
}
