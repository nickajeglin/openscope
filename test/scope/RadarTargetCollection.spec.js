import ava from 'ava';
import sinon from 'sinon';
import _includes from 'lodash/includes';
import _map from 'lodash/map';
import EventBus from '../../src/assets/scripts/client/lib/EventBus';
import RadarTargetCollection from '../../src/assets/scripts/client/scope/RadarTargetCollection';
import { THEME } from '../../src/assets/scripts/client/constants/themes';
import { RADAR_TARGET_ARRIVAL_MOCK } from './_mocks/radarTargetMocks';
import {
    arrivalAircraftFixture,
    departureAircraftFixture
} from '../aircraft/_mocks/aircraftMocks';

ava('does not throw when instantiated without parameters', (t) => {
    t.notThrows(() => new RadarTargetCollection());
});

ava('correctly sets properties when instantiated with theme parameter', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);

    t.deepEqual(collection._eventBus, EventBus);
    t.deepEqual(collection._items, []);
    t.deepEqual(collection._theme, THEME.DEFAULT);
});

ava('#items returns read-only values of #_items', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);

    t.deepEqual(collection.items, collection._items);
});

ava('.addRadarTargetModel() throws if argument is not a RadarTargetModel', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);
    const previousItems = collection._items;
    const invalidArgument = 'wazzup!!!';

    t.throws(() => collection.addRadarTargetModel(invalidArgument));
    t.true(previousItems.length === collection._items.length);
});

ava('.addRadarTargetModel() adds the supplied radar target to the collection', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);

    collection.addRadarTargetModel(RADAR_TARGET_ARRIVAL_MOCK);

    t.true(_includes(collection._items, RADAR_TARGET_ARRIVAL_MOCK));
});

ava('.addRadarTargetModelForAircraftModel() adds new radar target to collection for the provided aircraft model', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);

    collection.addRadarTargetModelForAircraftModel(arrivalAircraftFixture);

    t.deepEqual(collection._items[0].aircraftModel, arrivalAircraftFixture);
});

ava('.findRadarTargetModelForAircraftModel() returns undefined when aircraft has no corresponding radar target', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);
    const result = collection.findRadarTargetModelForAircraftModel(arrivalAircraftFixture);

    t.true(result === undefined);
});

ava('.findRadarTargetModelForAircraftModel() throws when multiple aircraft match', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);

    collection.addRadarTargetModelForAircraftModel(arrivalAircraftFixture);
    collection.addRadarTargetModelForAircraftModel(arrivalAircraftFixture);

    t.throws(() => collection.findRadarTargetModelForAircraftModel(arrivalAircraftFixture));
});

ava('.findRadarTargetModelForAircraftModel() returns radar target for corresponding supplied aircraft model', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);

    collection.addRadarTargetModelForAircraftModel(arrivalAircraftFixture);

    const result = collection.findRadarTargetModelForAircraftModel(arrivalAircraftFixture);

    t.deepEqual(result.aircraftModel, arrivalAircraftFixture);
});

ava('.findRadarTargetModelForAircraftReference() returns undefined when aircraft has no corresponding radar target', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);
    const aircraftReference = 'AAL432';
    const result = collection.findRadarTargetModelForAircraftReference(aircraftReference);

    t.true(result === undefined);
});

ava('.findRadarTargetModelForAircraftReference() returns undefined when multiple aircraft match', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);
    const aircraftReference = 'AAL432';

    collection.addRadarTargetModelForAircraftModel(arrivalAircraftFixture);
    collection.addRadarTargetModelForAircraftModel(arrivalAircraftFixture);

    const result = collection.findRadarTargetModelForAircraftReference(aircraftReference);

    t.true(result === undefined);
});

ava('.findRadarTargetModelForAircraftReference() returns radar target for corresponding supplied aircraft reference', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);
    const aircraftReference = 'AAL432';

    collection.addRadarTargetModelForAircraftModel(arrivalAircraftFixture);

    const result = collection.findRadarTargetModelForAircraftReference(aircraftReference);

    t.deepEqual(result.aircraftModel, arrivalAircraftFixture);
});

ava('.removeRadarTargetModelForAircraftModel() makes no changes when the specified aircraft does not have a corresponding radar target', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);

    collection.addRadarTargetModelForAircraftModel(arrivalAircraftFixture);

    const initialStateOfCollection = collection;

    collection.removeRadarTargetModelForAircraftModel(departureAircraftFixture);

    t.deepEqual(collection, initialStateOfCollection);
});

ava('.removeRadarTargetModelForAircraftModel() removes the corresponding radar target for the specified aircraft model', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);

    collection.addRadarTargetModelForAircraftModel(arrivalAircraftFixture);
    collection.addRadarTargetModelForAircraftModel(departureAircraftFixture);
    collection.removeRadarTargetModelForAircraftModel(arrivalAircraftFixture);

    const aircraftInCollection = _map(collection._items, (radarTargetModel) => radarTargetModel.aircraftModel);

    t.false(_includes(aircraftInCollection, arrivalAircraftFixture));
    t.true(_includes(aircraftInCollection, departureAircraftFixture));
});

ava('.resetAllRadarTargets() calls .reset() method of each radar target model in the collection', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);

    collection.addRadarTargetModelForAircraftModel(arrivalAircraftFixture);
    collection.addRadarTargetModelForAircraftModel(departureAircraftFixture);

    const arrivalAircraftResetSpy = sinon.spy(collection._items[0], 'reset');
    const departureAircraftResetSpy = sinon.spy(collection._items[1], 'reset');

    collection.resetAllRadarTargets();

    t.true(arrivalAircraftResetSpy.calledOnce);
    t.true(departureAircraftResetSpy.calledOnce);
});

ava('.reset() clears all radar target models from the collection', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);

    collection.addRadarTargetModelForAircraftModel(arrivalAircraftFixture);
    collection.addRadarTargetModelForAircraftModel(departureAircraftFixture);
    collection.reset();

    t.true(collection._items.length === 0);
});

ava('._setTheme returns early when an invalid theme name is passed', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);
    const themeName = 'great googly moogly!';

    collection._setTheme(themeName);

    t.true(collection._theme === THEME.DEFAULT);
});

ava('._setTheme() changes the value of #_theme', (t) => {
    const collection = new RadarTargetCollection(THEME.DEFAULT);
    const themeName = 'CLASSIC';

    collection._setTheme(themeName);

    t.true(collection._theme === THEME.CLASSIC);
});
