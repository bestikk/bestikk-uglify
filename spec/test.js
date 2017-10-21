require('./index.js');


describe('Node.js', function () {

  describe('Asciidoctor.js API', function () {
    it('should return Asciidoctor.js version', function () {
      expect(asciidoctor.getVersion()).toBe(packageJson.version);
    });
  });
});
