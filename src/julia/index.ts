
const module = ([x,y]) => Math.sqrt( x**2 + y**2);

export const getJuliaConvergence = (c: [number, number], z0: [number, number], max_iterations) => {
    let zN: [number, number] = [...z0];
    let iteration = 0;

    while(module(zN) < 2 && iteration < max_iterations) {
        // Zn = Z(n-1) ^ 2 + c
        // (a+bi)(a+bi) + (a'+b'i)
        // a²+2abi-b² + a' + b'i
        // a²-b²+a' + (2ab+b')i

        const a = zN[0]**2 - zN[1]**2 + c[0];
        const b = 2*zN[0]*zN[1] + c[1];
        zN = [a,b];        

        iteration++;
    }

    return iteration;

}

