import tape from "tape";
import sinon from "sinon";
import ExclusiveChildGroup from "../../../src/entities/childGroups/ExclusiveChildGroup";
import {
    fillChildGroup,
    stubFeature
} from "../../testUtil/stubFeature";

tape("selects last if parent was selected", test => {
    var uut = new ExclusiveChildGroup();
    fillChildGroup(3, uut);
    sinon.stub(uut, "selectLast");
    sinon.stub(uut, "selectAllPositive");
    sinon.stub(uut, "selectAllNegative");

    uut.onParentPositiveSelection();

    test.ok(uut.selectLast.calledOnce);
    test.ok(uut.selectAllPositive.notCalled);
    test.ok(uut.selectAllNegative.notCalled);
    test.end();
});

tape("selects others negative if feature was selected", test => {
    var uut = new ExclusiveChildGroup();
    fillChildGroup(3, uut);
    sinon.stub(uut, "selectLast");
    sinon.stub(uut, "selectAllPositive");
    sinon.stub(uut, "selectAllNegative");

    uut.onPositiveSelection();

    test.ok(uut.selectLast.notCalled);
    test.ok(uut.selectAllPositive.notCalled);
    test.ok(uut.selectAllNegative.calledOnce);
    test.end();
});

tape("selects parent negative if last feature was selected negative", test => {
    var parent = stubFeature();

    var uut = new ExclusiveChildGroup(parent);
    fillChildGroup(3, uut);
    uut.features[0].selection = false;
    uut.features[1].selection = false;
    uut.features[2].selection = false;

    sinon.stub(uut, "selectLast");
    sinon.stub(uut, "selectAllPositive");
    sinon.stub(uut, "selectAllNegative");

    uut.onNegativeSelection();

    test.ok(uut.selectLast.notCalled);
    test.ok(uut.selectAllPositive.notCalled);
    test.ok(uut.selectAllNegative.notCalled);
    test.ok(parent.selectNegative.calledOnce);
    test.end();
});

tape("selects last feature positive if feature selected negative and parent selected positive", test => {
    var parent = stubFeature(undefined, true);

    var uut = new ExclusiveChildGroup(parent);
    fillChildGroup(3, uut);
    uut.features[0].selection = false;
    uut.features[1].selection = undefined;
    uut.features[2].selection = false;

    sinon.stub(uut, "selectLast");
    sinon.stub(uut, "selectAllPositive");
    sinon.stub(uut, "selectAllNegative");

    uut.onNegativeSelection();

    test.ok(uut.selectLast.calledOnce);
    test.ok(uut.selectAllPositive.notCalled);
    test.ok(uut.selectAllNegative.notCalled);
    test.ok(parent.selectNegative.notCalled);
    test.end();
});

tape("does nothing if not last feature selected negative and parent not selected", test => {
    var parent = stubFeature();

    var uut = new ExclusiveChildGroup(parent);
    fillChildGroup(3, uut);
    uut.features[0].selection = false;
    uut.features[1].selection = undefined;
    uut.features[2].selection = false;

    sinon.stub(uut, "selectLast");
    sinon.stub(uut, "selectAllPositive");
    sinon.stub(uut, "selectAllNegative");

    uut.onNegativeSelection();

    test.ok(uut.selectLast.notCalled);
    test.ok(uut.selectAllPositive.notCalled);
    test.ok(uut.selectAllNegative.notCalled);
    test.ok(parent.selectNegative.notCalled);
    test.end();
});