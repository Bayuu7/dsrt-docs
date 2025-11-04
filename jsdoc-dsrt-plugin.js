exports.defineTags = function(dictionary) {
  dictionary.defineTag("dsrt.module", {
    onTagged: (doclet, tag) => { doclet.kind = "module"; }
  });
  dictionary.defineTag("dsrt.class", {
    onTagged: (doclet, tag) => { doclet.kind = "class"; }
  });
  dictionary.defineTag("dsrt.method", {
    onTagged: (doclet, tag) => { doclet.kind = "function"; }
  });
  dictionary.defineTag("dsrt.param", {
    onTagged: (doclet, tag) => { doclet.params = doclet.params || []; }
  });
  dictionary.defineTag("dsrt.return", {
    onTagged: (doclet, tag) => { doclet.returns = doclet.returns || []; }
  });
  dictionary.defineTag("dsrt.description", {
    onTagged: (doclet, tag) => { doclet.comment = tag.text; }
  });
};
