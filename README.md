# blockchain-notary

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/59f718b75b1542efaee8c56ab8e32151)](https://www.codacy.com/app/jparicka/blockchain-notary?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=jparicka/blockchain-notary&amp;utm_campaign=Badge_Grade)

A very simple and the second most logical Blockchain app leaveraging Smart Contracts.

### Before you get started

Remember that a blockchain is an immutable, sequential chain of records called Blocks. They can contain transactions, files or any data you like, really. But the important thing is that they’re chained together using hashes.


### What do I need?

There are various compatible clients for the protocol, the most popular being geth, a Go language implementation. However, it’s not the most developer-friendly. The best option I’ve found is the testrpc node (yes, the name sucks). Trust me, it will save you a lot of time. Install it and run it (you may need to prepend sudo depending on your setup):

```
$ npm install -g ethereumjs-testrpc
$ testrpc
```

You should run testrpc in a new terminal and leave it running while you develop. Each time you run testrpc, it will generate 10 new addresses with simulated test funds for you to use. This is not real money and you’re safe to try anything with no risk of losing funds.


### How it works

Blockchain Notary is an open source service that computes the cryptographic hash for your documents and store this cryptographic information on the Blockchain.

We use the SHA-2 algorithm to compute hash for your files and we never get to actually upload your file anywhere to a server. This means that your document content is 100% secured and cryptographically protected along the way.

Using our service, you will get the ultimate proof of your digital document yet it's secure and nobody but you gets to access the content whilst everyone will have an ability to verify it's authenticity. Yeah, and that's how it works really.  Blockchain rules.



### Donation Address

ETH: 0x45f5c8b556c3f2887b50184c823d1223f41a4156
