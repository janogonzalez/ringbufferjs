# ringbuffer.js

[![Build Status](https://travis-ci.com/janogonzalez/ringbufferjs.svg?branch=master)](
  https://travis-ci.com/janogonzalez/ringbufferjs)

A simple ring buffer data structure for Node.js.

## Installation

```
$ npm install ringbufferjs
```

## Example

```js
var RingBuffer = require('ringbufferjs');

var ring = new RingBuffer(2);

ring.enq(10);
ring.enq(5);
ring.enq(1); // 10 will be discarded
ring.size(); // 2
ring.peek(); // 5
ring.deq(); // 5
ring.size(); // 1
```

## API

### `RingBuffer()`

Initializes a new empty `RingBuffer` with the default capacity (50).

### `RingBuffer(capacity)`

Initializes a new empty `RingBuffer` with the given `capacity`.

### `RingBuffer(capacity, evictedCb)`

Initializes a new empty `RingBuffer` with the given `capacity` which will
execute the provided `evictedCb` when an element is evicted.

### `RingBuffer#capacity()`

Returns the capacity of the ring buffer.

### `RingBuffer#deq()`

Dequeues the top element of the ring buffer.
Throws an `Error` when the buffer is empty.

### `RingBuffer#deqN(count)`

Dequeues `count` elements from the top of the ring buffer and returns them.
Throws an `Error` if there are not enough elements in the buffer.

### `RingBuffer#enq(element)`

Enqueues the `element` at the end of the ring buffer and returns its new size.
When the buffer is full the oldest element is discarded.

### `RingBuffer#isEmpty()`

Returns whether the ring buffer is empty or not.

### `RingBuffer#isFull()`

Returns whether the ring buffer is full or not.

### `RingBuffer#peek()`

Peeks at the top element of the ring buffer.
Throws an `Error` when the buffer is empty.

### `RingBuffer#peekN(count)`

Returns `count` elements from the top of the ring buffer.
Throws an `Error` if there are not enough elements in the buffer.

### `RingBuffer#size()`

Returns the size of the ring buffer.

## Testing

```
$ npm install
$ npm test
```

## Licence

MIT
