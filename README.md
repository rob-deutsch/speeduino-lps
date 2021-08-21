# speeduino-lps

Command-line utility that displays a running log of Speeduino's loops-per-second.

## Installation

```
npm install -g speeduino-lps
```

## Example
```
$ npm install -g speeduino-lps
$ speeduino-lps
Serial ports available:-
[1]: /dev/tty.Bluetooth-Incoming-Port
[2]: /dev/tty.usbserial-0001
[3]: /dev/tty.SLAB_USBtoUART

prompt: Enter serial port ID:  2

Signature: speeduino 202108
Version info: Speeduino 2021.08
2021-08-20T15:55:05.655Z Loops per second: 6787
2021-08-20T15:55:06.648Z Loops per second: 6177
2021-08-20T15:55:07.653Z Loops per second: 7634
2021-08-20T15:55:08.658Z Loops per second: 8670
```

## See also

[js-speeduino-comm](https://github.com/rob-deutsch/js-speeduino-comm): A Javascript library to communicate with Speeduino.
