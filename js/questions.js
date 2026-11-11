/* Compatibility loader for pages that reference a single questions.js file. */
for (let part = 1; part <= 8; part += 1) {
  document.write(`<script src="js/questions-part-${part}.js"><\/script>`);
}
