import ava from "ava";
import sinon from "sinon";
import ExclusiveChildGroup from "../../../src/entities/childGroups/ExclusiveChildGroup";
import {
    fillChildGroup,
    stubFeature
} from "../../testUtil/stubFeature";

ava("selects last if parent was selected", test => {
    var uut = new ExclusiveChildGroup();
    fillChildGroup(3, uut);
    sinon.stub(uut, "selectLast");
    sinon.stub(uut, "selectAllPositive");
    sinon.stub(uut, "selectAllNegative");

    uut.onParentPositiveSelection();

    test.true(uut.selectLast.calledOnce);
    test.true(uut.selectAllPositive.notCalled);
    test.true(uut.selectAllNegative.notCalled);
});

ava("selects others negative if feature was selected", test => {
    var uut = new ExclusiveChildGroup();
    fillChildGroup(3, uut);
    sinon.stub(uut, "selectLast");
    sinon.stub(uut, "selectAllPositive");
    sinon.stub(uut, "selectAllNegative");

    uut.onPositiveSelection();

    test.true(uut.selectLast.notCalled);
    test.true(uut.selectAllPositive.notCalled);
    test.true(uut.selectAllNegative.calledOnce);
});

ava("selects parent negative if last feature was selected negative", test => {
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

    test.true(uut.selectLast.notCalled);
    test.true(uut.selectAllPositive.notCalled);
    test.true(uut.selectAllNegative.notCalled);
    test.true(parent.selectNegative.calledOnce);
});

ava("selects last feature positive if feature selected negative and parent selected positive", test => {
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

    test.true(uut.selectLast.calledOnce);
    test.true(uut.selectAllPositive.notCalled);
    test.true(uut.selectAllNegative.notCalled);
    test.true(parent.selectNegative.notCalled);
});

ava("does nothing if not last feature selected negative and parent not selected", test => {
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

    test.true(uut.selectLast.notCalled);
    test.true(uut.selectAllPositive.notCalled);
    test.true(uut.selectAllNegative.notCalled);
    test.true(parent.selectNegative.notCalled);
});