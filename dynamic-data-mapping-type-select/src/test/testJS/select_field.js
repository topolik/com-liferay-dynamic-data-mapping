'use strict';

var A = AUI();

var createSelectField = function(config) {
	return new Liferay.DDM.Field.Select(
		A.merge(
			{
				context: {
					name: 'selectField',
					required: true
				}
			},
			config || {}
		)
	).render(document.body);
};

describe(
	'Liferay.DDM.Field.Select',
	function() {
		var selectField;

		afterEach(
			function(done) {
				selectField.destroy();

				done();
			}
		);

		before(
			function(done) {
				AUI().use(
					'liferay-ddm-form-field-select-template',
					'liferay-ddm-form-field-select',
					function(A) {
						Liferay.DDM.Renderer.FieldTypes.register(
							{
								'javaScriptClass': 'Liferay.DDM.Field.Select',
								'name': 'select',
								'templateNamespace': 'ddm.select'
							}
						);

						done();
					}
				);
			}
		);

		describe(
			'.showErrorMessage()',
			function() {
				it(
					'should exists an error container if the select field has an error message',
					function(done) {
						selectField = createSelectField();

						selectField.set('errorMessage', 'error');

						selectField.set('options', [{label: 'a', value: 'a'}]);

						selectField.showErrorMessage();

						var container = selectField.get('container');

						assert.isNotNull(
							container.one('.help-block'),
							'The selectField has an error'
						);

						done();
					}
				);
			}
		);

		describe(
			'.setValue()',
			function() {
				it(
					'should return empty value if set an empty array value',
					function(done) {
						selectField = createSelectField();

						selectField.set('multiple', false);

						selectField.set('options', [{label: 'a', value: 'a'}]);

						selectField.setValue([]);

						assert.equal(
							selectField.getValue(),
							''
						);

						done();
					}
				);

				it(
					'should return empty value if set an empty string value',
					function(done) {
						selectField = createSelectField();

						selectField.set('multiple', false);

						selectField.set('options', [{label: 'a', value: 'a'}]);

						selectField.setValue('');

						assert.equal(
							selectField.getValue(),
							''
						);

						done();
					}
				);
			}
		);

		describe(
			'.getValue()',
			function() {
				it(
					'should return string value for single selectField',
					function(done) {
						selectField = createSelectField();

						selectField.set('multiple', false);

						selectField.set('options', [{label: 'a', value: 'a'}]);

						selectField.setValue(['a']);

						assert.equal(selectField.getValue(), 'a');

						done();
					}
				);

				it(
					'should return string values for multiple selectField',
					function(done) {
						selectField = createSelectField();

						selectField.set('multiple', true);

						selectField.set('options', [{label: 'a', value: 'a'}, {label: 'b', value: 'b'}, {label: 'c', value: 'c'}]);

						selectField.setValue(['a', 'c']);

						assert.equal(
							selectField.getValue(),
							'a,c'
						);

						done();
					}
				);

				it(
					'should return empty value if the select start with an empty array value',
					function(done) {
						selectField = createSelectField(
							{
								multiple: 'multiple',
								value: []
							}
						);

						selectField.set('options', [{label: 'a', value: 'a'}]);

						assert.equal(
							selectField.getValue(),
							''
						);

						done();
					}
				);

				it(
					'should return empty value if the select start with an empty string value',
					function(done) {
						selectField = createSelectField(
							{
								multiple: 'multiple',
								value: ''
							}
						);

						selectField.set('options', [{label: 'a', value: 'a'}]);

						assert.equal(
							selectField.getValue(),
							''
						);

						done();
					}
				);
			}
		);

		describe(
			'.clickSelectTrigger()',
			function() {
				it(
					'should add the focus class when opened',
					function(done) {
						selectField = createSelectField();

						var container = selectField.get('container');

						var divSelect = container.one('.form-builder-select-field');

						assert.isFalse(divSelect.hasClass('active'));

						divSelect.simulate('mousedown');

						assert.isTrue(divSelect.hasClass('active'));

						done();
					}
				);
			}
		);

		describe(
			'.closeList()',
			function() {
				it(
					'should close the list after click in document',
					function(done) {
						selectField = createSelectField();

						var container = selectField.get('container');

						var divSelect = container.one('.form-builder-select-field');

						divSelect.simulate('mousedown');

						assert.isNull(container.one('.drop-chosen.hide'));

						A.one(document).simulate('click');

						assert.isNotNull(container.one('.drop-chosen.hide'));

						done();
					}
				);

				it(
					'should remove the focus class when closed',
					function(done) {
						selectField = createSelectField();

						var container = selectField.get('container');

						var divSelect = container.one('.form-builder-select-field');

						divSelect.simulate('mousedown');

						assert.isTrue(divSelect.hasClass('active'));

						A.one(document).simulate('click');

						assert.isFalse(divSelect.hasClass('active'));

						done();
					}
				);
			}
		);

		describe(
			'.cleanSelect()',
			function() {
				it(
					'should clean value of the select',
					function() {
						selectField = createSelectField();

						selectField.set('options', [{label: 'a', value: 'a'}]);

						selectField.setValue(['a']);

						selectField.cleanSelect();

						assert.equal(selectField.get('value').length, 0);
					}
				);
			}
		);

		describe(
			'.clickItem()',
			function() {
				it(
					'should click item and get it value',
					function() {
						selectField = createSelectField();

						selectField.set('options', [{label: 'foo', value: 'foo'}, {label: 'bar', value: 'bar'}]);

						var container = selectField.get('container');

						container.one('.form-builder-select-field').simulate('click');

						var item = container.one('.form-builder-select-field').one('.drop-chosen ul li');

						item.simulate('click');

						assert.equal(selectField.getValue(), 'foo');
					}
				);
			}
		);
	}
);