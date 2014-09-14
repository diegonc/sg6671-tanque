
function generarIndexBuffer(M, N) {
    console.assert(M > 1, "M <= 1");
    console.assert(N > 1, "N <= 1");

    var buffer = [];
    /*
       M=5
       N=4
       
       0  1  2  3  4
       +--+--+--+--+
       5  6  7  8  9
       +--+--+--+--+
       10 11 12 13 14
       +--+--+--+--+
       15 16 17 18 19
       +--+--+--+--+
       
       Strip 1: [ 0, 5, 1, 6, 2, 7, 3, 8, 4, 9 ]
       Strip 2: [ 9, 14, 8, 13, 7, 12, 6, 11, 5, 10 ]
       Strip 3: [ 10, 15, 11, 16, 12, 17, 13, 18, 14, 19 ]
    */
    for (var i=0; i < (N - 1); i++) {
        var direccion = i % 2;
        var TIRA_A = M * i;
        var TIRA_B = M * (i + 1);
        if (direccion == 0) {
            for (var j=0; j < M; j++) {
                buffer.push(TIRA_A + j);
                buffer.push(TIRA_B + j);
            }
            // Esto agrega un triángulo más para corregir
            // la normal.
            if (i < (N-2)) {
                //buffer.push(TIRA_B + (M - 1));
            }
        } else {
            for (var j=(M - 1); j >= 0; j--) {
                buffer.push(TIRA_A + j);
                buffer.push(TIRA_B + j);
            }
            // Esto agrega un triángulo más para corregir
            // la normal.
            if (i < (N-2)) {
                //buffer.push(TIRA_B);
            }
        }
    }
    return buffer;
  }