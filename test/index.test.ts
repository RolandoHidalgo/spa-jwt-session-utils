import {compareSync, Options} from "dir-compare";
import {cp, checkName} from '../src/utils';
import tmp from 'tmp'
import {consola} from "consola";

tmp.setGracefulCleanup();

function defaultResultBuilderCallback(entry1, entry2, state, level,
                                      relativePath: string, options, statistics, diffSet, reason,
                                      permissionDeniedState): void {

    if (options.noDiffSet) {
        return
    }

}


const path1 = 'src';


// describe('asdasd', () => {
//     it('should create and return an object of ingredient details', done => {
//
//
//         // consola.info("JSON", {
//         //     name: "Cat",
//         //     color: "#454545",
//         // });
//
//
//
//         const tagged = consola.withTag("CREATED");
//         tagged.success('lalkslkdslk');
//
//         done()
//     })
//
//
// })

describe('Create method', () => {
    it('should create and return an object of ingredient details', done => {
        console.log('Dir: ', 'h');
        tmp.dir({unsafeCleanup: true}, async (err, path, cleanupCallback) => {
            if (err) throw err;

            console.log('Dir: ', path);
            // Create some files
            await cp('src', path, 'kkllop');
            console.log('despues de cp')
            const options: Options = {resultBuilder: defaultResultBuilderCallback};
            compareSync(path1, path, options);

            expect(1).not.toBeNull()
            // Manual cleanup
            cleanupCallback();
            done();
        })

    })

})


describe('lib name', () => {
    it('popular name must be taken', async () => {
        let taken = await checkName('react');
        expect(taken).toBeTruthy();
        taken = await checkName('kkjjhhjjhhjjh');
        expect(taken).toBeFalsy();

    })
    it('randoom name must not be taken', async () => {
        let taken = await checkName('react');
        expect(taken).toBeTruthy();
        taken = await checkName('kkjjhhjjhhjjh');
        expect(taken).toBeFalsy();

    })

})







