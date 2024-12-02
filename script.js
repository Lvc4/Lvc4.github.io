let tooltipTimer;

function galoisMultiply(a, b, irreduciblePoly) {
    let result = 0;
    const irreducibleDegree = getDegree(irreduciblePoly);
    while (b > 0) {
        if (b & 1) {
            result ^= a;
        }
        b >>= 1;
        a <<= 1;
        if (getDegree(a) >= irreducibleDegree) {
            a ^= irreduciblePoly;
        }
    }
    return result;
}

function galoisAdd(a, b) {
    return a ^ b;
}

function getDegree(poly) {
    let degree = 0;
    while (poly > 0) {
        poly >>= 1;
        degree++;
    }
    return degree - 1;
}

function modReduce(value, irreduciblePoly) {
    const irreducibleDegree = getDegree(irreduciblePoly);
    while (getDegree(value) >= irreducibleDegree) {
        const shiftAmount = getDegree(value) - irreducibleDegree;
        value ^= irreduciblePoly << shiftAmount;
    }
    return value;
}

function validateHex(value) {
    const hexRegex = /^[0-9A-Fa-f]+$/;
    return hexRegex.test(value);
}

function validateInputsAndCalculate() {
    const irreduciblePoly = document.getElementById('irreduciblePoly').value.trim();
    const polyA = document.getElementById('polyA').value.trim();
    const polyB = document.getElementById('polyB').value.trim();

    let valid = true;

    // Clear previous errors
    document.getElementById('irreduciblePolyError').textContent = '';
    document.getElementById('polyAError').textContent = '';
    document.getElementById('polyBError').textContent = '';

    if (!validateHex(irreduciblePoly)) {
        document.getElementById('irreduciblePolyError').textContent = 'Ungültiger Hex-Wert.';
        valid = false;
    }

    if (!validateHex(polyA)) {
        document.getElementById('polyAError').textContent = 'Ungültiger Hex-Wert.';
        valid = false;
    }

    if (!validateHex(polyB)) {
        document.getElementById('polyBError').textContent = 'Ungültiger Hex-Wert.';
        valid = false;
    }

    if (valid) {
        calculate();
    }
}

function calculate() {
    const polyA = document.getElementById('polyA').value.trim();
    const polyB = document.getElementById('polyB').value.trim();
    const irreduciblePoly = document.getElementById('irreduciblePoly').value.trim();
    
    const a = parseInt(polyA, 16);
    const b = parseInt(polyB, 16);
    const irreducible = parseInt(irreduciblePoly, 16);
    
    if (isNaN(a) || isNaN(b) || isNaN(irreducible)) {
        alert("Bitte gültige Hex-Werte eingeben.");
        return;
    }

    // Reduzierung von A und B
    const reducedA = modReduce(a, irreducible);
    const reducedB = modReduce(b, irreducible);

    const operation = document.getElementById('operation').value;
    let result;

    if (operation === 'multiply') {
        result = galoisMultiply(reducedA, reducedB, irreducible);
    } else if (operation === 'add') {
        result = galoisAdd(reducedA, reducedB);
    }

    const hexResult = '0x' + result.toString(16).toUpperCase();
    const polyResult = toPolynomial(result);

    document.getElementById('result').innerHTML = `
        <p>Hex: ${hexResult}</p>
        <p>Polynom: ${polyResult}</p>
    `;
}

function toPolynomial(value) {
    let terms = [];
    for (let i = 0; i < 8; i++) {
        if ((value >> i) & 1) {
            if (i === 0) {
                terms.push("1");
            } else if (i === 1) {
                terms.push("x");
            } else {
                terms.push(`x^${i}`);
            }
        }
    }
    return terms.reverse().join(" + ");
}

const irreducibleInput = document.getElementById('irreduciblePoly');
const tooltip = document.getElementById('tooltip');

irreducibleInput.addEventListener('mouseenter', () => {
    tooltipTimer = setTimeout(() => {
        tooltip.style.display = 'block';
    }, 500);
});

irreducibleInput.addEventListener('mousemove', (e) => {
    tooltip.style.left = e.pageX + 15 + 'px';
    tooltip.style.top = e.pageY + 15 + 'px';
});

irreducibleInput.addEventListener('mouseleave', () => {
    clearTimeout(tooltipTimer);
    tooltip.style.display = 'none';
});
