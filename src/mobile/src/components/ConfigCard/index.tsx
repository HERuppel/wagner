import React, { useState } from 'react';
import { Dimensions, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useMqtt } from '../../hooks/mqtt';
import { styles } from './styles';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../global/colors';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import CustomModal from '../Modal';

const ConfigCard = (): JSX.Element => {
  const { clientMqtt, configureBroker } = useMqtt();
  const formMethods = useForm()
  const { handleSubmit, control } = formMethods;
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const onSubmit = (data: any): void => {
    configureBroker({
      brokerUrl: data.host,
      options: {
        ...clientMqtt.options,
        port: Number(data.port),
        host: data.host
      }
    },
    () => setModalVisible(false));
  }

  const ModalButtonsSection = (): JSX.Element => (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        activeOpacity={.6}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.buttonsText}>Cancelar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={.6}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.buttonsText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Modal Section */}
      <CustomModal
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
        height={Dimensions.get('window').height / 2.4}
      >
        <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configurar Broker</Text>
            </View>
            <FormProvider { ...formMethods }>
              <Controller
                control={control}
                render={({field: { onChange, onBlur, value }}) => (
                  <>
                    <Text style={styles.label}>Host</Text>
                    <TextInput
                      style={styles.input}
                      selectionColor={colors.carolinaBlue}
                      underlineColorAndroid={colors.carolinaBlue}
                      onBlur={onBlur}
                      onChangeText={value => onChange(value)}
                      value={`${value}`}
                    />
                  </>
                )}
                defaultValue={`${clientMqtt?.options?.host}`}
                name="host"
                rules={{ required: true }}
              />
              <Controller
                control={control}
                render={({field: { onChange, onBlur, value }}) => (
                  <>
                    <Text style={styles.label}>Porta</Text>
                    <TextInput
                      style={styles.input}
                      selectionColor={colors.carolinaBlue}
                      underlineColorAndroid={colors.carolinaBlue}
                      onBlur={onBlur}
                      onChangeText={value => onChange(value)}
                      value={`${value}`}
                    />
                  </>
                )}
                defaultValue={`${clientMqtt?.options?.port}`}
                name="port"
                rules={{ required: true }}
              />
              <ModalButtonsSection />
            </FormProvider>
          </View>
        </CustomModal>
      {/* End Modal Section */}
      <TouchableOpacity
        activeOpacity={.6}
        style={styles.editButton}
        onPress={() => setModalVisible(true)}
      >
        <MaterialIcons name='edit' size={25} color={colors.aliceBlue} />
      </TouchableOpacity>
      <Text style={styles.propsText} numberOfLines={1}>Host: {clientMqtt?.options?.host || 'Broker indisponível'}</Text>
      <Text style={styles.propsText}>Porta: {clientMqtt?.options?.port || 'Porta indisponível'}</Text>
      <Text style={styles.propsText}>Protocolo: {clientMqtt?.options?.protocol || 'Protocolo indisponível'}</Text>
      <Text style={styles.propsText}>Cliente: {clientMqtt?.options?.clientId || 'Cliente indisponível'}</Text>
    </View>
  )
}

export default ConfigCard