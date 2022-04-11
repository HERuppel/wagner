import React, { useState } from 'react';
import { Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

import AntDesign from 'react-native-vector-icons/AntDesign'
import { colors } from '../../global/colors';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import { StackAppParams } from '../../routes/app.routes';
import ConfigCard from '../../components/ConfigCard';
import { useWagner } from '../../hooks/wagner';
import CustomModal from '../../components/Modal';
import { Controller, FormProvider, useForm } from 'react-hook-form';

const Config = (): JSX.Element => {
  const navigation = useNavigation<NavigationProp<StackAppParams>>();
  const { configs: { buttonsOption, controlTopic, speedTopic }, switchButtonsOption, changeTopics } = useWagner();
  const formMethods = useForm();
  const { control, handleSubmit } = formMethods;
  const [modalVisible, setModalVisible] = useState<number>(-1);

  const onSubmit = (data: any): void => {

    changeTopics(
      modalVisible === 0 ? data?.controlTopic : data?.speedTopic,
      modalVisible as 0 | 1,
      () => setModalVisible(-1)
    )
  }

  const ModalButtonsSection = (): JSX.Element => (
    <View style={styles.buttonsContainer}>
      <TouchableOpacity
        activeOpacity={.6}
        onPress={() => setModalVisible(-1)}
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
      {/* Modals Section */}
      <CustomModal 
        visible={modalVisible === 0 || modalVisible === 1} 
        onClose={() => setModalVisible(-1)}
        >
        {
          modalVisible === 0
            ? <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Tópico de Controle</Text>
              </View>
              <FormProvider { ...formMethods }>
                <Controller
                  control={control}
                  render={({field: { onChange, onBlur, value }}) => (
                    <>
                      <Text style={styles.label}>Tópico</Text>
                      <TextInput
                        style={styles.input}
                        selectionColor={colors.carolinaBlue}
                        underlineColorAndroid={colors.carolinaBlue}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                      />
                    </>
                  )}
                  defaultValue={controlTopic}
                  name="controlTopic"
                  rules={{ required: true }}
                />
                <ModalButtonsSection />
              </FormProvider>
            </View>
            : <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Tópico de Velocidade</Text>
              </View>
              <FormProvider { ...formMethods }>
                <Controller
                  control={control}
                  render={({field: { onChange, onBlur, value }}) => (
                    <>
                      <Text style={styles.label}>Tópico</Text>
                      <TextInput
                        style={styles.input}
                        selectionColor={colors.carolinaBlue}
                        underlineColorAndroid={colors.carolinaBlue}
                        onBlur={onBlur}
                        onChangeText={value => onChange(value)}
                        value={value}
                      />
                    </>
                  )}
                  defaultValue={speedTopic}
                  name="speedTopic"
                  rules={{ required: true }}
                />
                <ModalButtonsSection />
              </FormProvider>
            </View>
        }
      </CustomModal>
      {/* End Modals Section */}
      <View style={styles.header}>
        <TouchableOpacity
          activeOpacity={.6}
          onPress={() => navigation.navigate('Home', {})}
        >
          <AntDesign name='left' size={35} color={colors.aliceBlue} />
        </TouchableOpacity>
        <Text style={styles.title}>Configurações</Text>
        <TouchableOpacity
        >
          <AntDesign name='left' size={35} color={colors.prussianBlue} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <ConfigCard />
        <TouchableOpacity
          activeOpacity={.6}
          style={styles.switchContainer}
          onPress={() => switchButtonsOption(!buttonsOption)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.switchText}>{!buttonsOption ? 'Pressionar botões' : 'Segurar botões'}</Text>
            <Text style={styles.switchSubText}>{
              !buttonsOption
                ? 'A ação cessará imediatamente após o toque'
                : 'A ação cessará ao parar de pressionar o botão'
            
            }</Text>
          </View>
          <Switch 
            onChange={() => switchButtonsOption(!buttonsOption)}
            value={buttonsOption}
            thumbColor={colors.carolinaBlue}
            trackColor={{
              false: '#141414',
              true: colors.sapphireBlue
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.6}
          style={{ ...styles.switchContainer, alignItems: 'center' }}
          onPress={() => setModalVisible(0)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.switchText}>Tópico de controles</Text>
            <Text numberOfLines={1} style={styles.switchSubText}>{controlTopic}</Text>
          </View>
          <AntDesign name='right' color={colors.aliceBlue} size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={.6}
          style={{ ...styles.switchContainer, alignItems: 'center' }}
          onPress={() => setModalVisible(1)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.switchText}>Tópico de velocidade</Text>
            <Text numberOfLines={1} style={styles.switchSubText}>{speedTopic}</Text>
          </View>
          <AntDesign name='right' color={colors.aliceBlue} size={30} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Config;