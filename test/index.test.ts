import EmulateConnection from './test_implements/EmulateConnection';
import TestService from './test_implements/TestService';
import {ServiceController, RunningState} from '../';
import expect = require('expect.js');

describe('test remote-service', function () {

    let controller: ServiceController;
    let remote: TestService;
    let connection: EmulateConnection;

    beforeEach(function () {
        connection = new EmulateConnection();
        controller = new ServiceController(connection.port1);
        remote = new TestService(connection.port2);

        connection.printMessage(true);
    });

    afterEach(function () {
        remote.destroy();
        controller = undefined;
        remote = undefined;
        connection = undefined;
    });

    describe('test controller', function () {

        it('test empty remote service', function (done) {
            controller.execute('');
            setTimeout(function () {
                expect(controller.remote.cpuUsage).to.be.a('number');
                expect(controller.remote.memoryUsage).to.be.a('number');
                expect(controller.remote.startTime).to.not.be(undefined);
                expect(controller.remote.errors).to.be.empty();
                expect(controller.remote.runningState).to.be(RunningState.running);
                done();
            }, 1000);
        });

        describe('test invoke remote service', function () {

            it('test invoke', async function () {
                await controller.execute('rs.exports.test = function(value){return 123 + value}');
                const result = await controller.remote.services.test(456);
                expect(result).to.be(123 + 456);
            });

            it('test invoke error', function (done) {
                controller.execute('throw new Error("test")').catch(function (err) {
                    expect(err.message).to.be('test');
                    done();
                });
            });

            it('test invoke undefined service', function (done) {
                controller.remote.privateServices.undefined().catch(function (err: Error) {
                    expect(err).to.not.be(undefined);
                    done();
                });
            });
        });

        it('test receive remote event message', function (done) {
            controller.execute(`
             setTimeout(function () {
                rs.emit('test',123)
            },500)`);

            setTimeout(function () {
                controller.remote.event.on('test', function (data: any) {
                    expect(data).to.be(123);
                    done();
                });
            }, 1000);
        });
    });


    describe('test remote invoke controller service', function () {

    });

    describe('test remote receive controller message', function () {

    });

    describe('test remote catch uncaughtError', function () {

    });
});