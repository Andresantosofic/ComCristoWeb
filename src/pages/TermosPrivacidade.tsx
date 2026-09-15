import { useState } from 'react'
import {
  FileText,
  ShieldCheck,
} from 'lucide-react'
import './TermosPrivacidade.css'

function TermosPrivacidade() {
  const [abaAtiva, setAbaAtiva] = useState<
    'termos' | 'privacidade'
  >('termos')

  return (
    <main className="document-page">
      <section className="document-content">

        <header className="document-header">
          <h1>
            {abaAtiva === 'termos'
              ? 'Termos e Condições'
              : 'Política de Privacidade'}
          </h1>

          <p>
            {abaAtiva === 'termos'
              ? 'Conheça os termos de uso do Com Cristo.'
              : 'Saiba como tratamos as informações dos usuários.'}
          </p>
        </header>

        {/* ABAS */}

        <div className="document-tabs">

          <button
            type="button"
            className={
              abaAtiva === 'termos'
                ? 'document-tab document-tab-active'
                : 'document-tab'
            }
            onClick={() => setAbaAtiva('termos')}
          >
            <FileText size={18} />
            <span>Termos e Condições</span>
          </button>

          <button
            type="button"
            className={
              abaAtiva === 'privacidade'
                ? 'document-tab document-tab-active'
                : 'document-tab'
            }
            onClick={() => setAbaAtiva('privacidade')}
          >
            <ShieldCheck size={18} />
            <span>Política de Privacidade</span>
          </button>

        </div>

        {/* DOCUMENTO */}

        {abaAtiva === 'termos' ? (
          <article className="document-card">

            <div className="document-date">
              Última atualização: 28 de agosto de 2026
            </div>

            <p>
              Ao acessar e utilizar o aplicativo Com
              Cristo, você declara que leu, compreendeu e
              concorda com os presentes Termos e Condições
              de Uso. Caso não concorde com qualquer parte
              destes Termos, recomendamos que não utilize o
              aplicativo.
            </p>

            <DocumentSection
              title="1. Finalidade do aplicativo"
            >
              <p>
                O Com Cristo é um aplicativo cristão
                desenvolvido com o propósito de oferecer
                recursos de edificação espiritual, incluindo
                devocionais, versículos bíblicos, leitura da
                Bíblia, conteúdos de reflexão,
                acompanhamento de leitura, recursos
                relacionados à vida espiritual, publicações
                e notificações relacionadas aos conteúdos
                do aplicativo.
              </p>

              <p>
                O aplicativo busca oferecer uma experiência
                simples, acessível e acolhedora para pessoas
                que desejam utilizar recursos digitais
                relacionados à fé cristã.
              </p>
            </DocumentSection>

            <DocumentSection
              title="2. Natureza dos conteúdos"
            >
              <p>
                Os conteúdos disponibilizados pelo
                aplicativo possuem caráter espiritual,
                educacional e informativo.
              </p>

              <p>
                Os conteúdos não têm a finalidade de
                substituir aconselhamento pastoral
                individual, acompanhamento espiritual
                pessoal, orientação médica, acompanhamento
                psicológico, aconselhamento jurídico,
                orientação financeira ou qualquer outro
                serviço profissional especializado.
              </p>

              <p>
                O usuário é responsável pela forma como
                interpreta e utiliza as informações
                disponibilizadas pelo aplicativo.
              </p>
            </DocumentSection>

            <DocumentSection
              title="3. Responsabilidade do usuário"
            >
              <p>
                O usuário compromete-se a utilizar o
                aplicativo de maneira responsável, respeitosa
                e de acordo com a legislação aplicável.
              </p>

              <p>
                O usuário não deverá utilizar o aplicativo
                para atividades ilegais, tentativa de acesso
                não autorizado aos sistemas, exploração de
                falhas de segurança, distribuição de
                conteúdo ilícito, interferência no
                funcionamento do aplicativo, prática de
                fraude ou qualquer atividade que possa
                prejudicar outros usuários ou a plataforma.
              </p>
            </DocumentSection>

            <DocumentSection
              title="4. Conteúdo disponibilizado"
            >
              <p>
                O aplicativo poderá disponibilizar conteúdos
                bíblicos, devocionais, reflexões, imagens,
                textos, publicações e outros materiais
                relacionados à proposta do Com Cristo.
              </p>

              <p>
                Os conteúdos poderão ser modificados,
                atualizados, corrigidos, substituídos ou
                removidos a qualquer momento para melhorias
                da plataforma, correções, atualização
                editorial ou outros motivos relacionados ao
                funcionamento do aplicativo.
              </p>

              <p>
                A disponibilidade de determinado conteúdo
                não é garantida de forma permanente.
              </p>
            </DocumentSection>

            <DocumentSection
              title="5. Funcionalidades e disponibilidade"
            >
              <p>
                O aplicativo poderá receber novas
                funcionalidades, modificações, melhorias e
                correções ao longo do tempo.
              </p>

              <p>
                Determinadas funcionalidades poderão
                depender de conexão com a internet e de
                serviços de terceiros necessários para o
                funcionamento da plataforma.
              </p>

              <p>
                O desenvolvedor poderá realizar
                manutenções, atualizações ou alterações que
                ocasionem indisponibilidade temporária de
                determinadas funcionalidades.
              </p>
            </DocumentSection>

            <DocumentSection
              title="6. Informações e personalização"
            >
              <p>
                Algumas funcionalidades podem permitir que o
                usuário personalize sua experiência por meio
                de informações fornecidas voluntariamente ou
                por meio das interações realizadas dentro do
                aplicativo.
              </p>

              <p>
                Essas informações poderão ser utilizadas
                para disponibilizar recursos personalizados,
                acompanhar determinadas funcionalidades e
                melhorar a experiência do usuário.
              </p>

              <p>
                O tratamento dessas informações é detalhado
                na Política de Privacidade do Com Cristo.
              </p>
            </DocumentSection>

            <DocumentSection
              title="7. Notificações"
            >
              <p>
                O aplicativo poderá disponibilizar
                notificações relacionadas a versículos,
                devocionais, conteúdos espirituais e outras
                funcionalidades.
              </p>

              <p>
                O usuário poderá controlar as notificações
                por meio das configurações disponibilizadas
                pelo aplicativo e/ou pelo sistema operacional
                do dispositivo.
              </p>

              <p>
                A disponibilidade e o funcionamento das
                notificações podem depender de serviços de
                terceiros e das configurações do dispositivo.
              </p>
            </DocumentSection>

            <DocumentSection
              title="8. Apoio e contribuições"
            >
              <p>
                O aplicativo poderá disponibilizar formas
                voluntárias de apoio financeiro ao projeto,
                incluindo doações.
              </p>

              <p>
                As contribuições são voluntárias e não são
                obrigatórias para utilização das
                funcionalidades gratuitas do aplicativo.
              </p>

              <p>
                As contribuições não garantem benefícios,
                privilégios ou funcionalidades exclusivas,
                salvo quando expressamente informado pelo
                aplicativo.
              </p>
            </DocumentSection>

            <DocumentSection
              title="9. Propriedade intelectual"
            >
              <p>
                A identidade visual, marca, elementos
                gráficos, interface, textos próprios,
                imagens, códigos, funcionalidades e demais
                elementos desenvolvidos especificamente para
                o aplicativo Com Cristo poderão estar
                protegidos pela legislação aplicável de
                propriedade intelectual.
              </p>

              <p>
                Não é permitida a reprodução, distribuição,
                modificação ou utilização comercial de
                elementos pertencentes ao aplicativo sem
                autorização prévia, quando exigida.
              </p>

              <p>
                Conteúdos de terceiros eventualmente
                disponibilizados no aplicativo permanecem
                sujeitos aos respectivos direitos e condições
                aplicáveis.
              </p>
            </DocumentSection>

            <DocumentSection
              title="10. Links e serviços de terceiros"
            >
              <p>
                O aplicativo poderá utilizar ou
                disponibilizar serviços, recursos ou
                tecnologias fornecidos por terceiros.
              </p>

              <p>
                Esses serviços poderão possuir seus próprios
                termos de uso e políticas de privacidade.
              </p>

              <p>
                O desenvolvedor não é responsável pelas
                políticas, práticas ou indisponibilidade de
                serviços externos que não estejam sob seu
                controle direto.
              </p>
            </DocumentSection>

            <DocumentSection
              title="11. Segurança e uso indevido"
            >
              <p>
                O usuário não deverá tentar comprometer a
                segurança do aplicativo, seus servidores,
                bancos de dados ou serviços relacionados.
              </p>

              <p>
                Também não é permitido tentar obter acesso
                não autorizado a informações de outros
                usuários ou aos sistemas utilizados pelo
                aplicativo.
              </p>
            </DocumentSection>

            <DocumentSection
              title="12. Suspensão ou encerramento"
            >
              <p>
                O acesso a determinadas funcionalidades
                poderá ser limitado, suspenso ou interrompido
                em situações como uso indevido do aplicativo,
                violação destes Termos, tentativa de fraude,
                ameaça à segurança da plataforma, exigência
                legal, manutenção ou outros motivos técnicos
                ou operacionais.
              </p>

              <p>
                Sempre que possível, serão adotadas medidas
                proporcionais à situação.
              </p>
            </DocumentSection>

            <DocumentSection
              title="13. Alterações destes Termos"
            >
              <p>
                Estes Termos de Uso poderão ser atualizados
                periodicamente para refletir melhorias no
                aplicativo, novas funcionalidades, alterações
                na forma de funcionamento da plataforma,
                mudanças legais ou regulatórias, correções
                ou esclarecimentos.
              </p>

              <p>
                Quando necessário, a data de atualização
                será alterada no início deste documento.
              </p>

              <p>
                O uso continuado do aplicativo após
                alterações significa que o usuário tomou
                conhecimento da versão atualizada dos
                Termos.
              </p>
            </DocumentSection>

            <DocumentSection
              title="14. Limitação de responsabilidade"
            >
              <p>
                O desenvolvedor busca manter as informações
                e funcionalidades do aplicativo disponíveis
                e funcionando adequadamente, mas não garante
                que o aplicativo estará livre de erros,
                interrupções ou indisponibilidade.
              </p>

              <p>
                O desenvolvedor não se responsabiliza por
                prejuízos decorrentes de indisponibilidade
                temporária de serviços, falhas de conexão
                com a internet, problemas no dispositivo do
                usuário, serviços de terceiros, utilização
                inadequada do aplicativo ou decisões pessoais
                tomadas exclusivamente com base nos conteúdos
                disponibilizados.
              </p>
            </DocumentSection>

            <DocumentSection
              title="15. Contato"
            >
              <p>
                Em caso de dúvidas, sugestões, solicitações
                ou questões relacionadas ao aplicativo,
                entre em contato pelo e-mail:
              </p>

              <a href="mailto:contato.andresantosapps@gmail.com">
                contato.andresantosapps@gmail.com
              </a>
            </DocumentSection>

          </article>
        ) : (
          <article className="document-card">

            <div className="document-date">
              Última atualização: 28 de agosto de 2026
            </div>

            <p>
              O aplicativo Com Cristo valoriza a privacidade
              dos usuários e busca tratar as informações de
              maneira transparente, responsável e compatível
              com a finalidade das funcionalidades oferecidas.
            </p>

            <DocumentSection
              title="1. Informações que podem ser tratadas"
            >
              <p>
                Dependendo das funcionalidades utilizadas
                pelo usuário, o aplicativo poderá tratar
                informações fornecidas voluntariamente ou
                geradas durante a utilização, incluindo,
                quando aplicável, nome, idade, preferências,
                informações de personalização, progresso
                dentro do aplicativo, versículos favoritos,
                sentimentos ou registros realizados pelo
                usuário, informações técnicas necessárias ao
                funcionamento do aplicativo, informações
                relacionadas a notificações e identificadores
                técnicos necessários para determinados
                serviços.
              </p>

              <p>
                Nem todas essas informações são
                necessariamente coletadas de todos os
                usuários. O tratamento depende das
                funcionalidades utilizadas e da forma como o
                aplicativo estiver configurado.
              </p>
            </DocumentSection>

            <DocumentSection
              title="2. Informações armazenadas no dispositivo"
            >
              <p>
                Determinadas informações utilizadas para
                personalização e funcionamento do aplicativo
                podem ser armazenadas localmente no
                dispositivo do usuário.
              </p>

              <p>
                Isso pode incluir preferências, progresso e
                outras informações necessárias para
                determinadas funcionalidades.
              </p>

              <p>
                As informações armazenadas localmente podem
                ser removidas mediante limpeza dos dados do
                aplicativo, quando essa informação estiver
                armazenada exclusivamente no dispositivo.
              </p>
            </DocumentSection>

            <DocumentSection
              title="3. Serviços de armazenamento e infraestrutura"
            >
              <p>
                O aplicativo utiliza serviços de terceiros
                para disponibilizar determinadas
                funcionalidades e recursos de infraestrutura.
              </p>

              <p>
                Entre as tecnologias utilizadas pelo
                aplicativo está o Firebase/Google Firebase,
                incluindo serviços relacionados ao
                armazenamento e sincronização de informações
                necessários para o funcionamento de
                determinadas funcionalidades.
              </p>

              <p>
                Por meio desses serviços, determinadas
                informações poderão ser transmitidas e
                processadas em servidores utilizados pela
                infraestrutura do aplicativo.
              </p>

              <p>
                O uso desses serviços não significa que o
                aplicativo comercialize os dados dos usuários.
              </p>

              <p>
                Os serviços de terceiros possuem suas próprias
                políticas e condições de tratamento de dados.
              </p>
            </DocumentSection>

            <DocumentSection
              title="4. Dados relacionados às notificações"
            >
              <p>
                Para possibilitar determinadas funcionalidades
                de notificação, o aplicativo poderá utilizar
                identificadores técnicos relacionados ao
                dispositivo, como tokens de notificação.
              </p>

              <p>
                Essas informações poderão incluir dados
                técnicos como token de notificação, plataforma
                do dispositivo, versão do aplicativo, status
                de ativação e data de cadastro ou atualização.
              </p>

              <p>
                Essas informações são utilizadas para
                possibilitar o funcionamento das notificações
                e recursos relacionados.
              </p>

              <p>
                O usuário poderá controlar as notificações
                por meio das configurações disponíveis no
                aplicativo e/ou no sistema operacional do
                dispositivo.
              </p>
            </DocumentSection>

            <DocumentSection
              title="5. Finalidade do tratamento"
            >
              <p>
                As informações tratadas pelo aplicativo
                poderão ser utilizadas para fornecer as
                funcionalidades solicitadas pelo usuário,
                personalizar a experiência dentro do
                aplicativo, armazenar preferências, manter o
                progresso de determinadas funcionalidades,
                disponibilizar conteúdos, sincronizar
                informações necessárias ao funcionamento de
                recursos, enviar notificações quando
                autorizadas, manter a segurança e estabilidade
                da plataforma, corrigir erros, melhorar o
                funcionamento do aplicativo, atender
                solicitações realizadas pelo usuário e cumprir
                obrigações legais quando aplicável.
              </p>

              <p>
                As informações não deverão ser utilizadas para
                finalidades incompatíveis com aquelas
                apresentadas nesta Política.
              </p>
            </DocumentSection>

            <DocumentSection
              title="6. Compartilhamento e processamento por terceiros"
            >
              <p>
                O Com Cristo não vende informações pessoais dos
                usuários.
              </p>

              <p>
                Entretanto, determinados dados técnicos ou
                informações necessárias ao funcionamento das
                funcionalidades poderão ser processados por
                provedores de serviços utilizados pelo
                aplicativo.
              </p>

              <p>
                Esses provedores podem atuar, por exemplo, na
                infraestrutura, armazenamento, sincronização,
                notificações ou funcionamento técnico da
                plataforma.
              </p>

              <p>
                O tratamento realizado por esses serviços
                ocorre de acordo com as funcionalidades
                utilizadas pelo aplicativo e com as políticas
                aplicáveis de cada provedor.
              </p>
            </DocumentSection>

            <DocumentSection
              title="7. Dados utilizados para publicidade"
            >
              <p>
                As informações fornecidas ao aplicativo não são
                destinadas à venda de dados pessoais para
                terceiros.
              </p>

              <p>
                Caso futuramente sejam implementados serviços
                de publicidade, análise ou outras tecnologias
                que alterem significativamente a forma de
                tratamento de dados, esta Política de
                Privacidade deverá ser atualizada para refletir
                essas alterações antes de sua utilização,
                quando necessário.
              </p>
            </DocumentSection>

            <DocumentSection
              title="8. Permissões do dispositivo"
            >
              <p>
                Dependendo das funcionalidades
                disponibilizadas, o aplicativo poderá solicitar
                determinadas permissões do dispositivo.
              </p>

              <p>
                Por exemplo, uma funcionalidade de foto de
                perfil poderá exigir acesso à câmera ou à
                seleção de imagens.
              </p>

              <p>
                As permissões são solicitadas de acordo com as
                necessidades das funcionalidades
                correspondentes e podem ser controladas pelo
                usuário nas configurações do dispositivo,
                quando permitido pelo sistema operacional.
              </p>

              <p>
                O aplicativo não deverá solicitar acesso a uma
                permissão sem relação com a funcionalidade
                correspondente.
              </p>
            </DocumentSection>

            <DocumentSection
              title="9. Compartilhamento iniciado pelo usuário"
            >
              <p>
                Algumas funcionalidades podem permitir que o
                próprio usuário escolha compartilhar conteúdos,
                imagens, versículos ou outros materiais por
                meio de aplicativos instalados no dispositivo.
              </p>

              <p>
                Quando o usuário utiliza voluntariamente uma
                função de compartilhamento, o conteúdo
                selecionado poderá ser encaminhado ao
                aplicativo ou serviço escolhido pelo próprio
                usuário.
              </p>

              <p>
                O tratamento realizado pelo aplicativo de
                terceiros utilizado para o compartilhamento
                estará sujeito à respectiva política de
                privacidade.
              </p>
            </DocumentSection>

            <DocumentSection
              title="10. Segurança das informações"
            >
              <p>
                O desenvolvedor adota medidas técnicas e
                organizacionais razoáveis para proteger as
                informações tratadas pelo aplicativo contra
                acesso, alteração, divulgação ou utilização
                indevida.
              </p>

              <p>
                As informações transmitidas entre o aplicativo
                e serviços de infraestrutura são destinadas a
                ser protegidas por mecanismos de segurança
                apropriados aos serviços utilizados.
              </p>

              <p>
                Entretanto, nenhum sistema eletrônico,
                dispositivo, rede ou método de transmissão pode
                ser considerado absolutamente seguro.
              </p>

              <p>
                Por esse motivo, embora sejam adotadas medidas
                de proteção, não é possível garantir segurança
                absoluta contra todos os riscos existentes.
              </p>
            </DocumentSection>

            <DocumentSection
              title="11. Retenção das informações"
            >
              <p>
                As informações poderão ser mantidas pelo
                período necessário para fornecer as
                funcionalidades solicitadas, manter
                preferências e configurações, cumprir
                finalidades legítimas relacionadas ao
                funcionamento do aplicativo, atender
                obrigações legais, solucionar problemas,
                prevenir abusos ou fraudes ou cumprir outras
                finalidades legítimas descritas nesta Política.
              </p>

              <p>
                Informações armazenadas exclusivamente no
                dispositivo poderão permanecer até que sejam
                apagadas pelo usuário ou pelo próprio sistema.
              </p>

              <p>
                Informações armazenadas em serviços externos
                poderão permanecer enquanto forem necessárias
                para a finalidade para a qual foram coletadas,
                observadas as obrigações legais aplicáveis.
              </p>
            </DocumentSection>

            <DocumentSection
              title="12. Exclusão de informações"
            >
              <p>
                O usuário poderá excluir informações
                armazenadas localmente por meio das opções
                disponíveis no próprio aplicativo, quando
                existentes, ou por meio das configurações do
                dispositivo.
              </p>

              <p>
                Caso o usuário deseje solicitar a exclusão de
                informações eventualmente armazenadas em
                serviços utilizados pelo aplicativo, poderá
                entrar em contato pelo e-mail:
              </p>

              <a href="mailto:contato.andresantosapps@gmail.com">
                contato.andresantosapps@gmail.com
              </a>

              <p>
                A solicitação deverá, quando necessário,
                conter informações suficientes para identificar
                os dados a serem excluídos.
              </p>

              <p>
                Após o recebimento da solicitação, serão
                avaliados os dados relacionados ao pedido e
                adotadas as medidas cabíveis, observadas
                eventuais obrigações legais de retenção.
              </p>
            </DocumentSection>

            <DocumentSection
              title="13. Dados de crianças e adolescentes"
            >
              <p>
                O aplicativo não tem como objetivo coletar
                intencionalmente informações pessoais de
                crianças para finalidades diferentes das
                necessárias ao funcionamento das
                funcionalidades oferecidas.
              </p>

              <p>
                Quando houver tratamento de dados de crianças
                ou adolescentes, deverão ser observadas as
                exigências legais e as políticas aplicáveis às
                respectivas faixas etárias.
              </p>

              <p>
                O responsável legal que identificar tratamento
                inadequado de informações de um menor poderá
                entrar em contato pelo e-mail indicado nesta
                Política.
              </p>
            </DocumentSection>

            <DocumentSection
              title="14. Links e serviços externos"
            >
              <p>
                O aplicativo poderá utilizar serviços externos
                necessários ao seu funcionamento.
              </p>

              <p>
                Esses serviços poderão possuir suas próprias
                políticas de privacidade.
              </p>

              <p>
                O usuário deve consultar as políticas dos
                respectivos provedores quando utilizar serviços
                externos ou funcionalidades que direcionem para
                outras plataformas.
              </p>
            </DocumentSection>

            <DocumentSection
              title="15. Direitos e solicitações do usuário"
            >
              <p>
                O usuário poderá entrar em contato para
                solicitar informações relacionadas ao
                tratamento de seus dados, quando aplicável,
                bem como solicitar correção ou exclusão de
                informações que estejam sob controle do
                desenvolvedor, observadas as limitações legais
                e técnicas aplicáveis.
              </p>

              <p>
                As solicitações poderão ser encaminhadas para:
              </p>

              <a href="mailto:contato.andresantosapps@gmail.com">
                contato.andresantosapps@gmail.com
              </a>
            </DocumentSection>

            <DocumentSection
              title="16. Alterações desta Política"
            >
              <p>
                Esta Política de Privacidade poderá ser
                atualizada periodicamente para refletir
                alterações no aplicativo, novas funcionalidades,
                alterações nos serviços utilizados, mudanças na
                forma de tratamento de informações, melhorias
                de segurança ou alterações legais ou
                regulatórias.
              </p>

              <p>
                A data apresentada no início desta Política
                indicará a versão mais recente.
              </p>

              <p>
                Quando houver mudanças relevantes, o aplicativo
                poderá apresentar informações adicionais ao
                usuário, quando apropriado.
              </p>
            </DocumentSection>

            <DocumentSection
              title="17. Contato"
            >
              <p>
                Para dúvidas, sugestões, solicitações
                relacionadas à privacidade ou pedidos
                relacionados às informações tratadas pelo
                aplicativo, entre em contato:
              </p>

              <a href="mailto:contato.andresantosapps@gmail.com">
                contato.andresantosapps@gmail.com
              </a>
            </DocumentSection>

          </article>
        )}

      </section>
    </main>
  )
}

type DocumentSectionProps = {
  title: string
  children: React.ReactNode
}

function DocumentSection({
  title,
  children,
}: DocumentSectionProps) {
  return (
    <section className="document-section">
      <h2>
        {title}
      </h2>

      <div className="document-section-content">
        {children}
      </div>
    </section>
  )
}

export default TermosPrivacidade