/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, OnModuleInit } from '@nestjs/common';
import ModbusRTU from 'modbus-serial';

@Injectable()
export class AppService implements OnModuleInit {
  onModuleInit() {
    this.modbusFirstLoad();
  }

  async modbusFirstLoad() {
    console.log('\nStarted modbusFirstLoad()\n');
    const client = new ModbusRTU();

    await client.connectTCP('10.32.170.166', { port: 502, timeout: 20000 });
    console.log('\nClient Connected\n');
    const startAddress = 0; // Endereço do primeiro registrador a ser lido
    const endAddress = 65535; // Endereço do último registrador a ser lido
    const maxRegisters = 125; // Número máximo de registros a serem lidos de uma só vez

    // Loop que lê os valores de todos os registradores de holding
    for (
      let address = startAddress;
      address <= endAddress;
      address += maxRegisters
    ) {
      for (let i = 0; i < maxRegisters; i++) {
        const result = await client.readHoldingRegisters(address, i);
        console.log(
          `Endereço ${address} => Valor do registrador ${i}: ${result}`,
        );
      }
    }
  }
}
