const EthRPC = require('../index.js');
const assert = require('chai').assert;
const TestRPC = require('ethereumjs-testrpc');
const HTTPProvider = require('ethjs-provider-http');
const provider = TestRPC.provider({});
const provider2 = TestRPC.provider({});

describe('ethjs-rpc', () => {
  describe('construction', () => {
    it('should construct normally', () => {
      const eth = new EthRPC(provider);

      assert.equal(typeof eth, 'object');
      assert.equal(typeof eth.currentProvider, 'object');
      assert.equal(typeof eth.options, 'object');
    });

    it('should throw when invalid construction params', () => {
      assert.throws(() => EthRPC(provider), Error); // eslint-disable-line
    });
  });

  describe('setProvider', () => {
    it('should change provider', (done) => {
      const eth = new EthRPC(provider);
      eth.sendAsync({ method: 'eth_accounts' }, (err, accounts1) => {
        assert.equal(err, null);
        eth.setProvider(provider2);

        eth.sendAsync({ method: 'eth_accounts' }, (err2, accounts2) => {
          assert.equal(err2, null);
          assert.notDeepEqual(accounts1, accounts2);

          eth.sendAsync({ method: 'eth_accounts' })
          .then((accounts3) => {
            assert.deepEqual(accounts3, accounts2);
            done();
          })
          .catch((error) => console.log(error));
        });
      });
    });

    it('should handle invalid provider', () => {
      assert.throws(() => new EthRPC(23423), Error);
    });
  });

  describe('sendAsync', () => {
    it('should handle normal calls', (done) => {
      const eth = new EthRPC(provider);
      eth.sendAsync({ method: 'eth_accounts' }, (err, accounts1) => {
        assert.equal(err, null);
        assert.equal(Array.isArray(accounts1), true);
        assert.equal(accounts1.length > 0, true);
        done();
      });
    });

    it('should handle invalid response', (done) => {
      const eth = new EthRPC({ sendAsync: (payload, cb) => {
        cb(null, { error: 'Some Error!!' });
      } });
      eth.sendAsync({ method: 'eth_accounts' }, (err, accounts1) => {
        assert.equal(typeof err, 'object');
        assert.equal(accounts1, null);
        done();
      });
    });

    it('should handle invalid response from infura ropsten geth/parity nodes', (done) => {
      const infuraProvider = new HTTPProvider('https://ropsten.infura.io');
      const eth = new EthRPC(infuraProvider);
      eth.sendAsync({
        id: 8883061436998317,
        jsonrpc: '2.0',
        params: [{
          'gas': '0x2dc6c0', // eslint-disable-line
          'value': '0x00', // eslint-disable-line
          'from': '0x70ad465e0bab6504002ad58c744ed89c7da38524', // eslint-disable-line
          'to': '0xad7d27bc87dba2f5ebcaeb1e7670a1d18104087b', // eslint-disable-line
          'data': '0xd89b73d00000000000000000000000000000000000000000000000000000000000000000'}, 'latest'], // eslint-disable-line
          'method': 'eth_call' // eslint-disable-line
      }, (err, accounts1) => {
        assert.equal(typeof err, 'object');
        assert.equal(accounts1, null);
        done();
      });
    });

    it('should handle invalid errors', (done) => {
      const eth = new EthRPC({ sendAsync: (payload, cb) => {
        cb('Some error!');
      } });
      eth.sendAsync({ method: 'eth_accounts' }, (err, accounts1) => {
        assert.equal(typeof err, 'object');
        assert.equal(accounts1, null);
        done();
      });
    });
  });
});
