var expect = require('expect.js');
var RingBuffer = require('..');

describe('RingBuffer()', function() {
  it('returns an new RingBuffer', function() {
    expect(new RingBuffer()).to.be.a(RingBuffer);
  });

  it('accepts an initial capacity', function() {
    expect(new RingBuffer(2)).to.be.a(RingBuffer);
  });

  describe('#capacity()', function() {
    it('returns the capacity of the ring buffer', function() {
      var buffer = new RingBuffer(2);
      expect(buffer.capacity()).to.be(2);
    });
  });

  describe('#isEmpty()', function() {
    it('returns true when the ring buffer is empty', function() {
      var buffer = new RingBuffer();
      expect(buffer.isEmpty()).to.be(true);
    });

    it('returns false when the ring buffer is not empty', function() {
      var buffer = new RingBuffer();
      buffer.enq('jano');
      expect(buffer.isEmpty()).to.be(false);
    });
  });

  describe('#isFull()', function() {
    it('returns false when the ring buffer is not full', function() {
      var buffer = new RingBuffer(1);
      expect(buffer.isFull()).to.be(false);
    });

    it('returns true when the ring buffer is full', function() {
      var buffer = new RingBuffer(1);
      buffer.enq('jano');
      expect(buffer.isFull()).to.be(true);
    });
  });

  describe('#peek()', function() {
    it('fails when the ring buffer is empty', function() {
      var buffer = new RingBuffer();
      expect(function() {
        buffer.peek();
      }).to.throwException('RingBuffer is empty');
    });

    it('returns the top element of the ring buffer', function() {
      var buffer = new RingBuffer();
      buffer.enq('jano');
      buffer.enq('valentina');
      expect(buffer.peek()).to.be('jano');
    });
  });

  describe('#peekN()', function() {
    it ('fails when too many elements are requested', function() {
      var buffer = new RingBuffer();
      buffer.enq('jano');
      buffer.enq('valentina');
      expect(function() {
        buffer.peekN(3);
      }).to.throwException('Not enough elements in RingBuffer');
    });

    it('returns elements of the ring buffer', function() {
      var buffer = new RingBuffer();
      buffer.enq('jano');
      buffer.enq('valentina');
      expect(buffer.peekN(2)).to.eql(['jano', 'valentina']);
    });

    it('returns elements when wrapping round', function() {
      var buffer = new RingBuffer(3);
      buffer.enq('jano');
      buffer.enq('valentina');
      buffer.enq('fran');
      expect(buffer.deq()).to.be('jano');
      buffer.enq('herbert');
      expect(buffer.peekN(3)).to.eql(['valentina', 'fran', 'herbert']);
    });
  });

  describe('#deq()', function() {
    it('fails when the ring buffer is empty', function() {
      var buffer = new RingBuffer();
      expect(function() {
        buffer.deq();
      }).to.throwException('RingBuffer is empty');
    });

    it('dequeues the top element of the ring buffer', function() {
      var buffer = new RingBuffer();
      buffer.enq('jano');
      buffer.enq('valentina');
      expect(buffer.deq()).to.be('jano');
      expect(buffer.size()).to.be(1);
    });
  });

  describe('#deqN()', function() {
    it ('fails when too many elements are requested', function() {
      var buffer = new RingBuffer();
      buffer.enq('jano');
      buffer.enq('valentina');
      expect(function() {
        buffer.deqN(3);
      }).to.throwException('Not enough elements in RingBuffer');
    });

    it('dequeues elements', function() {
      var buffer = new RingBuffer();
      buffer.enq('jano');
      buffer.enq('valentina');
      expect(buffer.deqN(2)).to.eql(['jano', 'valentina']);
      expect(buffer.size()).to.be(0);
    });

    it('dequeues elements when wrapping round', function() {
      var buffer = new RingBuffer(3);
      buffer.enq('jano');
      buffer.enq('valentina');
      buffer.enq('fran');
      buffer.deq(); // jano
      buffer.enq('herbert'); // at index 0
      expect(buffer.deqN(3)).to.eql(['valentina', 'fran', 'herbert']);
      expect(buffer.size()).to.be(0);

      // ensure _first has been set correctly:
      buffer.enq('jano');
      buffer.enq('valentina');
      expect(buffer.deq()).to.be('jano');
      expect(buffer.deq()).to.be('valentina');
    });
  });

  describe('#enq()', function() {
    context('when the buffer is not full', function() {
      it('enqueues an element at the end of the ring buffer', function() {
        var buffer = new RingBuffer();
        buffer.enq('jano');
        buffer.enq('valentina');
        expect(buffer.peek()).to.be('jano');
        expect(buffer.size()).to.be(2);
      });

      it('returns the new size of the ring buffer', function() {
        var buffer = new RingBuffer();
        expect(buffer.enq('jano')).to.be(1);
      });
    });

    context('when the buffer is full', function() {
      it('overwrites the oldest element', function() {
        var buffer = new RingBuffer(2);
        buffer.enq('jano');
        buffer.enq('valentina');
        buffer.enq('fran');
        expect(buffer.peek()).to.be('valentina');
      });

      it('returns the new size of the ring buffer', function() {
        var buffer = new RingBuffer(2);
        expect(buffer.enq('jano')).to.be(1);
        expect(buffer.enq('valentina')).to.be(2);
        expect(buffer.enq('fran')).to.be(2);
      });

      it('triggers a evicted element callback', function() {
        var hit = 0;
        function evictedCb(evicted) {
          expect(evicted).to.be('jano');
          ++hit;
        }
        var buffer = new RingBuffer(2, evictedCb);
        expect(buffer.enq('jano')).to.be(1);
        expect(buffer.enq('valentina')).to.be(2);
        expect(buffer.enq('fran')).to.be(2);
        expect(hit).to.be(1);
      });
    });
  });

  describe('#size()', function() {
    it('returns 0 when the ring buffer is empty', function() {
      var buffer = new RingBuffer();
      expect(buffer.size()).to.be(0);
    });

    it('returns the size of the ring buffer', function() {
      var buffer = new RingBuffer();
      buffer.enq('jano');
      buffer.enq('valentina');
      expect(buffer.size()).to.be(2);
    });
  });
});
