export default function Serializer(serializeModel, deserializeModel, serializeConfiguration, deserializeConfiguration) {
    this.serializeModel = serializeModel;
    this.deserializeModel = deserializeModel;
    this.serializeConfiguration = serializeConfiguration;
    this.deserializeConfiguration = deserializeConfiguration;
}