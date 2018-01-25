# livy [![Build Status](https://travis-ci.org/sethbonnie/livy.svg?branch=master)](https://travis-ci.org/sethbonnie/livy)

> "We fear things in proportion to our ignorance of them." - Titus Livius

Livy is a simple logging interface useful for keeping track of event histories. You can think of each instance of `History` as a linked list where the newest items will appear at the top of the log.

Each entry in the log is automatically timestamped with an id equal to the time inserted in milliseconds. The shape of an entry is as follows:

```
{
  type: <String>,
  timestamp: <Date.toISOString()>,
  data: <Object|String>
}
```

## Installation
```
$ npm install livy
```

Or using yarn:

```
$ yarn add livy
```

## Usage

```js
import History from 'livy';

// Create a new log that never exceeds 25 items
const log = new History({ limit: 25 });

// log.insert(<type>, <payload>)
log.insert('SENT', 'hello there!');
// Some time later...
log.insert('RECEIVED', 'howdy!');

// dump the log to JSON
const serializedJSON = log.serialize();

// dump the log to array
const array = log.toArray();
```

## API

### `import(data)`

*Merges the given data into the log where `data` is in the forms given by `serialize()`
and `toArray()`.*

### `insert(type, payload)`

*Inserts the given type and payload into the log with a 
generated `timestamp` <DateTime ISO string> value.*

### `limit()`

*Returns the limit at which the log will not grow past. Default is 100.*

### `serialize([start], [end])`

*Returns a copy of the log in stringified version form.*

### `setLimit(newLimit)`

*If the size of the log is larger than `newLimit`, this operation truncates the log to fit the new limit.*

### `size()`

*Returns the number of items in the log. `size()` will never be greater than `limit().`*

### `toArray()`

*Returns a copy of the log in `Array` form.*

License
=======

The MIT License (MIT)

Copyright &copy; 2018 Seth Bonnie

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
