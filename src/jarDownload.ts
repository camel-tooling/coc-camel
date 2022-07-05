// Download Camel LS Jar from
// https://repo1.maven.org/maven2/com/github/camel-tooling/camel-lsp-server/1.5.0/camel-lsp-server-1.5.0.jar
//

import * as https from 'https'
import * as fs from 'fs'

// const urlPrefix = "https://repo1.maven.org/maven2/com/github/camel-tooling/camel-lsp-server/"
// const url = urlPrefix + '1.5.0' + '/' + 'camel-lsp-server-' + '1.5.0' + '.jar'

// console.log("Complete url:", url)

export function download_camells_Jar(jar_Url: string, jar_Version: string, jar_Name: string, jarSuffix: string){
    // console.log("camellsJar:", jar_Url + jar_Version + '/' + jar_Name + jar_Version + '.jar')
    
    // Remote URL path to download Camel LS
    const remote_Path =  jar_Url + jar_Version + '/' + jar_Name + '-' + jar_Version + jarSuffix

    https.get(remote_Path, 
         (res) => {
             const local_Path = '/opt' + '/' + jar_Name + '-' + jar_Version + jarSuffix 
             const writeStream = fs.createWriteStream(local_Path);

             res.pipe(writeStream)
             writeStream.on("finish", () => {
                 writeStream.close()
                 // console.log("Download Completed")
            })
         })
    }
