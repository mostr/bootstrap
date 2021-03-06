package pl.softwaremill.bootstrap.service.config

import pl.softwaremill.common.conf.{ MapWrapper, Configuration, Config }
import java.util

object BootstrapConfiguration {

  val config: Config[String, String] = try {
    Configuration.get("application")
  } catch {
    case e: RuntimeException => new MapWrapper(new util.HashMap[String, String]())
  }

  val smtpHost            = config.get("smtpHost")
  val smtpPort            = config.get("smtpPort")
  val smtpUserName        = config.get("smtpUsername")
  val smtpPassword        = config.get("smtpPassword")
  val from                = config.get("from")
  val taskSQSQueue        = config.get("queue")
  val awsAccessKeyId      = config.get("AWSAccessKeyId")
  val awsSecretAccessKey  = config.get("SecretAccessKey")
  val encoding            = config.get("encoding")

}
