import { getPeers as proto } from "./proto/protos";

export const getPeers = {
	request: {
		deserialize: (payload: Buffer): {} => proto.GetPeersRequest.decode(payload),
		serialize: (object: proto.GetPeersRequest): Buffer =>
			Buffer.from(proto.GetPeersRequest.encode(object).finish()),
	},
	response: {
		deserialize: (payload: Buffer): proto.IGetPeersResponse =>
			proto.GetPeersResponse.toObject(proto.GetPeersResponse.decode(payload), { defaults: true }),
		serialize: (object: proto.IGetPeersResponse): Buffer =>
			Buffer.from(proto.GetPeersResponse.encode(object).finish()),
	},
};
