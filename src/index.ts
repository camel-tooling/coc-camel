import { ExtensionContext, services, workspace, LanguageClient } from 'coc.nvim'
import { download_camells_Jar } from './jarDownload'
import * as glob from 'glob'

export async function activate(context: ExtensionContext): Promise<void> {
    /*                                                           
     * Writing coc-camel extension to solve the following problems
     *
     * 1. Download the Camel LS Jar file from the remote system
     * 2. Start language server through coc.nvim Library instead of making changes to coc-settings.json
     *
     *
     * Also had few issues storing camells Jar in the github repo along with other regular files. So download camells Jar on-demand and 
     * removing it from coc-camel/server
     *                         
     */
    const config = workspace.getConfiguration('coc-camel')
    const isEnable = config.get<boolean>('enable', true)
      if (!isEnable) {
        return
    }

    const camells_Jar = {
    name: 'camel-lsp-server',
    version: '1.5.0',
    remote_Path: 'https://repo1.maven.org/maven2/com/github/camel-tooling/camel-lsp-server/',
    local_Path: '/opt',
    suffix: '.jar'
    }

    const jarPath = camells_Jar.local_Path + '/' + camells_Jar.name + '-' + camells_Jar.version + camells_Jar.suffix
    const jarFound = glob.sync(jarPath)
    
    // Verify camells is already available on the local system
    if (! Boolean(jarFound[0])) {
    // console.log("Couldn't find Jar File, So downloading the Camel LS Jar")
    download_camells_Jar(camells_Jar.remote_Path,
                 camells_Jar.version,
                 camells_Jar.name,
                 camells_Jar.suffix
    )
    }
    
    const serverOptions = {
        // command: '/usr/bin/java -jar'.concat(' ').concat(jarPath).toString() // run camells
        command: 'java',
        args: ["-jar", jarPath]
    }
    
    const clientOptions = {
        documentSelector: ['java', 'xml'] // run camells on java files
    }
    const client = new LanguageClient('coc-camel', // the id
                              'coc-camel', // the name of the language server
                          serverOptions,
                          clientOptions,
                             true
    )
    context.subscriptions.push(services.registLanguageClient(client))
}
