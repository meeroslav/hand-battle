/**
 * Created by Miro on 25.11.2014.
 */
describe('translation consistency test: ', function() {
	var translations;

	beforeEach(function () {
		translations = window.missing.module('HandBattle').translation();
	});

	it('every language should have same number of elements', function(){
		var keys = Object.keys(translations);
		if (keys.length > 1) {
			for (var i = 1; i < keys.length; i++) {
				expect(Object.keys(translations[keys[0]]).length).toEqual(Object.keys(translations[keys[i]]).length);
			}
		}
	});
	it('every field in one language should exist in other', function(){
		var languages = Object.keys(translations);
		if (languages.length > 1) {
			for (var i = 1; i < languages.length; i++) {
				var keys = Object.keys(translations[languages[0]]);
				for (var j=0; j < keys.length; j++) {
					expect(translations[languages[i]][keys[j]]).toBeDefined();
				}
			}
		}
	});
});