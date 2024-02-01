import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  AddressByIndexRequest,
  AddressByIndexResponse,
} from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/view/v1alpha1/view_pb';
import { ServicesInterface } from '@penumbra-zone/types';
import { createContextValues, createHandlerContext, HandlerContext } from '@connectrpc/connect';
import { ViewProtocolService } from '@buf/penumbra-zone_penumbra.connectrpc_es/penumbra/view/v1alpha1/view_connect';
import { servicesCtx } from '../../ctx';
import { addressByIndex } from './address-by-index';
import { Address } from '@buf/penumbra-zone_penumbra.bufbuild_es/penumbra/core/keys/v1alpha1/keys_pb';

vi.mock('@penumbra-zone/wasm-bundler', () => vi.importActual('@penumbra-zone/wasm-nodejs'));

describe('AddressByIndex request handler', () => {
  let mockServices: ServicesInterface;
  let mockCtx: HandlerContext;

  beforeEach(() => {
    mockServices = {
      getWalletServices: () =>
        Promise.resolve({
          viewServer: {
            fullViewingKey:
              'penumbrafullviewingkey1vzfytwlvq067g2kz095vn7sgcft47hga40atrg5zu2crskm6tyyjysm28qg5nth2fqmdf5n0q530jreumjlsrcxjwtfv6zdmfpe5kqsa5lg09',
          },
        }),
    } as ServicesInterface;

    mockCtx = createHandlerContext({
      service: ViewProtocolService,
      method: ViewProtocolService.methods.addressByIndex,
      protocolName: 'mock',
      requestMethod: 'MOCK',
      contextValues: createContextValues().set(servicesCtx, mockServices),
    });
  });

  test('should successfully get AddressByIndex with default index', async () => {
    const addressByIndexResponse = await addressByIndex(new AddressByIndexRequest(), mockCtx);
    expect(addressByIndexResponse.address).toBeInstanceOf(Address);
  });

  test('default address and address with index 0 should be equal', async () => {
    const defaultAddressResponse = new AddressByIndexResponse(
      await addressByIndex(new AddressByIndexRequest(), mockCtx),
    );
    const index0Response = new AddressByIndexResponse(
      await addressByIndex(new AddressByIndexRequest({ addressIndex: { account: 0 } }), mockCtx),
    );
    expect(defaultAddressResponse.address?.equals(index0Response.address)).toBeTruthy();
  });

  test('addresses with different indexes should be different', async () => {
    const index0Response = new AddressByIndexResponse(
      await addressByIndex(new AddressByIndexRequest({ addressIndex: { account: 0 } }), mockCtx),
    );
    const index1Response = new AddressByIndexResponse(
      await addressByIndex(new AddressByIndexRequest({ addressIndex: { account: 1 } }), mockCtx),
    );
    expect(index0Response.address?.equals(index1Response.address)).toBeFalsy();
  });
});