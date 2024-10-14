import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { IErrorMessage } from 'difport/utils'
import { json, Request, Response, urlencoded } from 'express'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './http-exception'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true
  })

  const envApiUrl = process.env.API_URL
  if (!envApiUrl) {
    app.use('*', (req: Request, res: Response) => {
      res.json({
        init: false
      })
    })
  } else {
    app.useGlobalFilters(new HttpExceptionFilter())
    app.useGlobalPipes(
      new ValidationPipe({
        exceptionFactory: (errors) => {
          const result: IErrorMessage[] = errors.map((error) => ({
            property: error.property,
            message: error.constraints[Object.keys(error.constraints)[0]]
          }))
          return new BadRequestException(result)
        },
        stopAtFirstError: true
      })
    )
    app.use(json({ limit: '50mb' }))
    app.use(urlencoded({ extended: true, limit: '50mb' }))
    app.setGlobalPrefix(process.env.API_PREFIX)
    app.enableShutdownHooks()
    await app.listen(process.env.API_PORT)
    console.log('start', process.env.API_PORT, process.env.API_PREFIX)
  }
}
bootstrap()
