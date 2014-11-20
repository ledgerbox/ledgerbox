angular.module("app")

.factory('ddInvoice', ['$log', '$q', 'pdfMake', function($log, $q, pm) {
	var styles = {
		h1: {
			fontSize: 16,
			bold: true
		},
		h2: {
			fontSize: 11,
			bold: true
		},
		nr: {
			fontSize: 9
		},
		sm: {
			fontSize: 8
		},
		em: {
			bold: true
		},
		right: {
			alignment: 'right'
		}
	}

	function QrCode(inv, companyData) {

		function UQRDate(d) {
			return d.replace(/\-/g, "");
		}

		var uqr = {
			"uqr": 1,
			"tp": 1,
			"nme": companyData.fnamn,
			"cid": companyData.orgnr,
			"iref": inv.num,
			"idt": UQRDate(inv.date),
			"ddt": UQRDate(inv.maturity),
			"due": inv.toBePaid.toFixed(),
			"vat": inv.totalVAT.toFixed(),
			"pt": companyData.pt,
			"acc": companyData.acc
		}
		console.log(JSON.stringify(uqr));
		return {
			qr: JSON.stringify(uqr),
			alignment: 'right',
			fit: 90,
			margin: [0, 20, 0, 0]
		};
	}

	function header(inv, companyData) {
		var hdr = {
			table: {
				widths: ['*', 220],
				body: [],
				margin: [0, 0, 0, 8]
			},
			layout: pm.emptyLayout
		};

		var body = hdr.table.body;
		body.push([
			pm.stack([
				pm.image(companyData.logo, { fit: [75,75] } ),
				pm.st(companyData.fname || '[FNAME]', 'h1'),
				pm.box(pm.columns([{
					text: 'Referens:\nDröjsmålsränta: '
					},
					inv.ref + '\n' + inv.penaltyInterest
				], {
					style: 'nr'
				}), {
					margin: [0, 5, 4, 4]
				})	
			]),
			pm.stack([
				pm.box(pm.columns([
					pm.st('Faktura', 'h1'),
					pm.text('', {
						width: '*'
					}),
					pm.vOffset(pm.st('Nummer ' + inv.num, 'h2'), 5)
				]), {
					margin: [0, 0, 0, 4]
				}, '#eee'),
				pm.columns([
					pm.box([pm.st('Fakturadatum', 'nr', 'em'), pm.st(inv.date, 'nr', 'em')], {
						margin: [0, 0, 0, 4]
					}, '#eee'),
					pm.text('', {
						width: 10
					}),
					pm.box([pm.st('Förfallotdatum', 'nr'), pm.st(inv.maturity, 'nr')], {
						margin: [0, 0, 0, 4]
					}, '#eee')
				], {
					alignment: 'center'
				}),
				pm.box(pm.stack([
					inv.customer.name,
					inv.customer.address, ' ',
					inv.customer.street + ' ' + inv.customer.city, 
					' '
				], {
					style: 'nr',
					margin: [0, 0, 0, 11]
				}))
			])
		]);

		return hdr;
	}

	function lines(inv) {

		var layout = {
			hLineWidth: function(row, node) {
				return (row < 2 || row === node.table.body.length) ? 1 : 0
			},
			vLineWidth: function(col, node) {
				return (col === 0 || col === node.table.body[0].length) ? 1 : 0
			},
		}

		var lines = {
			table: {
				widths: ['*', 'auto', 'auto', 'auto', 'auto'],
				body: []
			},
			layout: layout
		};
		var body = lines.table.body;

		body.push([
			pm.st('Text', 'nr', 'em'),
			pm.st('Antal', 'nr', 'em', 'right'),
			pm.st('À-pris', 'nr', 'em', 'right'),
			pm.st('Pris exkl. moms', 'nr', 'em', 'right'),
			pm.st('Momssats', 'nr', 'em', 'right')
		]);
		var i = 0;
		for (i = 0; i < inv.lines.length; i++) {
			var line = inv.lines[i];
			body.push([
				pm.st(line.text, 'nr'),
				pm.st(pm.cc(line.qty, 0), 'nr', 'right'),
				pm.st(pm.cc(line.unitPrice), 'nr', 'right'),
				pm.st(pm.cc(line.priceExclTax), 'nr', 'right'),
				pm.st(pm.pct(line.VATRate), 'nr', 'right')
			]);
		}
		while (i < 10) {
			body.push([pm.text('x', {
				color: '#fff'
			}), pm.text(''), pm.text(''), pm.text(''), pm.text('')]);
			i++;
		}

		return lines;
	}

	function VATGroups(inv) {
		var node = {
			table: {
				widths: [30, 50, 30, 40, 50],
				body: []
			},
			layout: pm.boxLayout
		};
		var body = node.table.body;
		body.push([pm.text('Momsspecifikation', {
			style: ['sm', 'em'],
			colSpan: 5
		}), pm.text(''), pm.text(''), pm.text(''), pm.text('')])
		body.push([
			pm.st('\nMoms', 'sm'),
			pm.st('Pris\nexkl moms', 'sm', 'right'),
			pm.st('Moms\ni kr', 'sm', 'right'),
			pm.st('Öresav-\nrundning', 'sm', 'right'),
			pm.st('Summa', 'sm', 'right')
		]);

		for (var i = 0; i < inv.VATGroups.length; i++) {
			var vg = inv.VATGroups[i];
			body.push([
				pm.st(pm.pct(vg.VATRate), 'sm'),
				pm.st(pm.cc(vg.priceExclTax, 0), 'nr', 'right', 'em'),
				pm.st(pm.cc(vg.VAT, 0), 'nr', 'right', 'em'),
				pm.st(vg.rounding ? pm.cc(vg.rounding) : '', 'nr', 'right', 'em'),
				pm.st(pm.cc(vg.total, 0), 'nr', 'right', 'em')
			]);
		}
		return node;
	}

	function summary(inv) {
		var node = {
			table: {
				widths: [200, '*', 90],
				body: []
			},
			layout: pm.emptyLayout,
			margin: [0, 4, 0, 0]
		};
		var body = node.table.body;
		body.push([
			VATGroups(inv), {
				text: '',
				width: '*'
			},
			pm.box(pm.stack([
				pm.text('Att betala', {
					fontSize: 11,
					bold: true,
					alignment: 'right'
				}),
				pm.text(pm.cc(inv.toBePaid, 0) + ' kr', {
					fontSize: 11,
					alignment: 'right'
				})
			], {
				margin: [10, 0, 0, 21]
			}), {}, '#eee')
		])
		return node;
	}

	function footer(companyData) {
		function h(text) {
			return pm.st(text || '', 'sm', 'em')
		}

		function b(text) {
			return pm.st(text || '', 'sm')
		}
		
		var node = {
			table: {
				widths: [150, 'auto', 'auto', '*'],
				body: []
			},
			layout: pm.boxLayout,
			margin: [0, 20, 0, 0]
		};
		var body = node.table.body;
		body.push([
			h('Adressupgifter'), 
			h('Telefon'), 
			h('E-post/webbplats'), 
			pm.st('Godkänd för F-skatt', ['sm', 'em', 'right'])
		]);
		body.push([
			b( (companyData.fname || '') + '\n' + (companyData.utdelningsadr || '') +  '\n' + (companyData.ort || '')),
			b(companyData.tel),
			b((companyData.epost || '') +  '\n' + (companyData.web || '')), 
			pm.text('')
		]);
		body.push([
			pm.text(''), h('Momsreg.nr'), h('Bankgiro'), pm.text('')
		]);
		body.push([
			pm.text(''), 
			b(companyData.orgnr), 
			b(companyData.acc), 
			pm.text('')
		]);
		return node;
	}

	function getDd(invoice, companyData) {
		var dd = {
			styles: styles,
			pageMargins: [72, 72, 72, 72],
			paperSize: 'A4',
			content: []
		}

		dd.content.push(header(invoice, companyData));
		dd.content.push(lines(invoice));
		dd.content.push(summary(invoice));
		dd.content.push(QrCode(invoice, companyData));
		dd.content.push(footer(companyData));

		return dd;
	}


	return function(inv, companyData) {
		var deferred = $q.defer();
		var dd = getDd(inv, companyData);
		pm.printer.createPdf(dd).getDataUrl(function(result) {
			if (result) deferred.resolve(result);
			else {
				$log.error('Error genereating PDF s Data Url for document definition');
				deferred.reject('No Data Url');
			}
		});
		return deferred.promise;
	}
}]);
