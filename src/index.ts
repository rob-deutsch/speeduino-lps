#!/usr/bin/env node

import SerialPort from 'serialport'
import prompt from 'prompt';
import { SpeeduinoComm } from 'speeduino-comm'
import { Command } from 'commander';
import { hasUncaughtExceptionCaptureCallback } from 'process';
const program = new Command();

program.option('-d, --device <dev>', 'serial device')
program.parse(process.argv)

async function promptForDevicePath(): Promise<string> {
    const ports = await SerialPort.list()
    console.log("Serial ports available:-")
    for (let idx in ports) {
        const port = ports[idx]
        console.log(`[${parseInt(idx) + 1}]: ${port.path}`)
    }
    console.log()

    prompt.start()
    let schema: prompt.Schema[] = [{
        properties: {
            id: {
                description: 'Enter serial port ID',
                required: true,
                message: 'Invalid choice (must be a number)',
                conform: (value) => (value >= 1) && (value <= ports.length)
            }
        }
    }]

    return prompt.get(schema).then(choice => ports[parseInt(choice['id'] as string) - 1].path)
}

async function toothLogReady(speedy: SpeeduinoComm, checkInterval: number): Promise<void> {
    let int = new Promise<void>(resolve => setTimeout(resolve, checkInterval))
    let och = Buffer.alloc(2)
    while (!(och[1]>>6)) {
        och = await speedy.raw.outputChannels(121,0,0x30,0)
    }
    return int
}


async function main() {
    let portPath: string

    if (program.opts().device) {
        portPath = program.opts().device
    } else {
        portPath = await promptForDevicePath()
    }

    const speedy = new SpeeduinoComm({ path: portPath, options: { baudRate: 115200, autoOpen: false } })
    speedy.raw.on('error', () => { throw "Serial port error" })
    speedy.raw.on('unexpected', (data) => { console.log("Unexpected data:", data); throw "ERROR" })

    speedy.open(err => {
        if (err) {
            throw "Error opening"
        }
        speedy.startToothLogger().then(() => {
            console.log("Tooth logger started");
        }).then(async () => {
            while (true) {
                await toothLogReady(speedy, 1000/5)
                let teethTime = await speedy.toothLog()
                for (let t of teethTime) {
                    console.log(t);
                }
            }
        })
    })
}

main()